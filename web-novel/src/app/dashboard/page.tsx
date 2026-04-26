import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
  Plus, 
  BookOpen, 
  Eye, 
  MessageSquare, 
  Coins, 
  TrendingUp, 
  Users, 
  Star,
  ChevronRight,
  Edit3,
  MoreVertical,
  BarChart2
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { getStorageUrl } from '@/lib/storage';

async function getWriterStats(userId: string) {
  const novels = await prisma.novel.findMany({
    where: { authorId: userId },
    include: {
      _count: {
        select: { 
          chapters: true, 
          reviews: true,
          bookmarks: true 
        }
      },
      ratings: { select: { score: true } }
    }
  });

  const totalViews = novels.reduce((sum, n) => sum + n.views, 0);
  const totalChapters = novels.reduce((sum, n) => sum + n._count.chapters, 0);
  const totalReviews = novels.reduce((sum, n) => sum + n._count.reviews, 0);
  
  // Calculate potential earnings (simplified)
  const earnings = await prisma.coinTransaction.aggregate({
    where: { userId, type: 'EARN' },
    _sum: { amount: true }
  });

  return {
    novels,
    totalViews,
    totalChapters,
    totalReviews,
    totalEarnings: earnings._sum.amount || 0
  };
}

export default async function WriterDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const { novels, totalViews, totalChapters, totalReviews, totalEarnings } = await getWriterStats((session.user as any).id);

  const stats = [
    { label: 'ยอดเข้าชมทั้งหมด', value: formatNumber(totalViews), icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'รายได้ทั้งหมด', value: `${formatNumber(totalEarnings)} เหรียญ`, icon: Coins, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'ผู้ติดตามนักเขียน', value: '1,240', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'คะแนนรีวิวเฉลี่ย', value: '4.8', icon: Star, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Writer Studio</h1>
          <p className="text-gray-500 font-medium">ยินดีต้อนรับกลับมา, {session.user.name} วันนี้พร้อมที่จะเขียนตอนต่อไปหรือยัง?</p>
        </div>
        <Link 
          href="/write" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          สร้างนิยายใหม่
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">+12%</span>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Novels List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary-600" />
              ผลงานของฉัน ({novels.length})
            </h2>
            <Link href="/write" className="text-sm font-bold text-primary-600 hover:underline">ดูทั้งหมด</Link>
          </div>

          <div className="space-y-4">
            {novels.map((novel) => (
              <div key={novel.id} className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm hover:border-primary-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-28 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0 shadow-sm">
                    <img 
                      src={getStorageUrl(novel.coverImage, 'novel-cover')} 
                      alt={novel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                        novel.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {novel.status}
                      </span>
                      <span className="text-[9px] font-black px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full uppercase tracking-tighter">
                        {novel.isFree ? 'Free' : 'Premium'}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 truncate mb-1">{novel.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400">
                      <div className="flex items-center gap-1">
                        <BarChart2 className="w-3.5 h-3.5" />
                        {novel.views} วิว
                      </div>
                      <div className="flex items-center gap-1">
                        <Edit3 className="w-3.5 h-3.5" />
                        {novel._count.chapters} ตอน
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        {novel._count.reviews} รีวิว
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link 
                      href={`/write?id=${novel.id}`}
                      className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all"
                    >
                      <Edit3 className="w-5 h-5" />
                    </Link>
                    <button className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {novels.length === 0 && (
              <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2rem] p-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">ยังไม่มีผลงานเขียน</h3>
                <p className="text-sm text-gray-500 mb-6">เริ่มแชร์จินตนาการของคุณกับนักอ่านนับล้านได้เลย</p>
                <Link href="/write" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-100">สร้างนิยายเรื่องแรก</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Engagement & Feedback */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 px-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            การตอบรับล่าสุด
          </h2>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="font-black text-gray-900">รีวิวล่าสุด</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full"></div>
                    <div>
                      <p className="text-xs font-black text-gray-900">นักอ่าน_{i}</p>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-2 h-2 text-amber-400 fill-amber-400" />)}
                      </div>
                    </div>
                    <span className="ml-auto text-[9px] font-bold text-gray-400 uppercase">2 ชม. ที่แล้ว</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">"เนื้อเรื่องสนุกมากครับ ติดตามตอนต่อไปอยู่นะครับ สู้ๆ ครับผู้เขียน..."</p>
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-xs font-bold text-gray-400 hover:text-primary-600 transition-colors bg-gray-50/50">ดูรีวิวทั้งหมด</button>
          </div>

          {/* Quick Tips for Authors */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-black mb-2">เคล็ดลับนักเขียน</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">การอัปเดตนิยายสม่ำเสมอสัปดาห์ละ 3-4 ตอน จะช่วยเพิ่มโอกาสให้ถูกแนะนำบนหน้าแรกมากขึ้นถึง 40%!</p>
              <button className="flex items-center gap-2 text-xs font-black text-white bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
                เรียนรู้เพิ่มเติม
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <BarChart2 className="w-32 h-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
