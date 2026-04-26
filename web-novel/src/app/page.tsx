import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Star, TrendingUp, PenTool, Coins, ChevronRight, Users, BookMarked, Eye, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { NovelCard } from '@/components/NovelCard';
import { SectionHeader } from '@/components/SectionHeader';

export default async function Home() {
  const novels = await prisma.novel.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      author: { select: { username: true } },
      categories: true,
    },
    orderBy: { views: 'desc' },
    take: 8,
  });

  const recentNovels = await prisma.novel.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      author: { select: { username: true } },
      categories: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { novels: true } },
    },
    orderBy: { name: 'asc' },
  });

  const novelCount = await prisma.novel.count({ where: { status: 'PUBLISHED' } });
  const authorCount = await prisma.user.count({ where: { role: 'AUTHOR' } });
  const readerCount = await prisma.user.count({ where: { role: 'READER' } });

  return (
    <div className="space-y-24 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="text-center lg:text-left space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 border border-primary-100 text-[13px] font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>แหล่งรวมนักอ่านและนักเขียนนิยายออนไลน์</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] text-balance">
                ปลดปล่อยพลัง<br />
                <span className="text-primary-600">แห่งจินตนาการ</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance font-medium">
                ร่วมเป็นส่วนหนึ่งของชุมชนนักเล่าเรื่องที่เติบโตเร็วที่สุด ค้นพบเรื่องราวที่คุณจะรัก และสร้างสรรค์ผลงานของคุณเอง
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-5">
                <Link href="/novels" className="px-10 py-4.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:-translate-y-0.5">
                  เริ่มอ่านนิยาย
                </Link>
                <Link href="/write" className="px-10 py-4.5 bg-white text-slate-900 border-2 border-slate-100 rounded-full font-bold hover:bg-slate-50 transition-all hover:border-slate-200">
                  แชร์เรื่องราวของคุณ
                </Link>
              </div>
              <div className="flex justify-center lg:justify-start gap-12 pt-6">
                {[
                  { label: 'นิยายทั้งหมด', value: novelCount },
                  { label: 'นักเขียน', value: authorCount },
                  { label: 'นักอ่าน', value: readerCount },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-3xl font-black text-slate-900 tabular-nums">{stat.value.toLocaleString()}</div>
                    <div className="text-[13px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-primary-100/30 rounded-full blur-[120px] -z-10 animate-pulse" />
              <div className="relative bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200 -rotate-2">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-slate-50">
                   <img 
                    src="https://placehold.co/800x600/f8fafc/e11d48?text=NovelThai+Reader" 
                    alt="NovelThai Experience" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xl flex items-center gap-4 rotate-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Coins className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">สนับสนุนนักเขียน</div>
                    <div className="text-xs text-slate-500 font-medium">รายได้โดยตรงจากผู้อ่าน</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Simplified */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">อ่านได้ทุกที่</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              รองรับการอ่านทุกอุปกรณ์ ทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์ พร้อมระบบถนอมสายตา
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">เขียนได้ง่ายๆ</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              เครื่องมือช่วยเขียนที่ออกแบบมาเพื่อนักเขียนโดยเฉพาะ จัดการตอนและเนื้อหาได้สะดวก
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">ระบบเหรียญทอง</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              สนับสนุนนักเขียนที่คุณรักผ่านระบบเติมเหรียญที่ปลอดภัยและโปร่งใส
            </p>
          </div>
        </div>
      </section>

      {/* Popular Novels Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="นิยายยอดนิยม" href="/novels" icon={<TrendingUp className="w-6 h-6" />} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8">
          {novels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-slate-100/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="หมวดหมู่ยอดนิยม" href="/categories" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/novels?category=${cat.slug}`}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group"
              >
                <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{cat._count.novels} เรื่อง</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="นิยายอัปเดตใหม่" href="/novels?sort=newest" icon={<BookMarked className="w-6 h-6" />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentNovels.map((novel) => (
            <Link
              key={novel.id}
              href={`/novel/${novel.id}`}
              className="flex gap-4 p-3 rounded-2xl bg-white border border-slate-100 hover:border-primary-100 hover:shadow-sm transition-all group"
            >
              <div className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100">
                <img 
                  src={novel.coverImage || 'https://placehold.co/150x200/f8fafc/e11d48?text=Cover'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={novel.title} 
                />
              </div>
              <div className="flex flex-col py-1">
                <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">{novel.title}</h3>
                <p className="text-xs text-slate-500 mt-1">โดย {novel.author.username}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {novel.categories.map(cat => (
                    <span key={cat.id} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      {cat.name}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {novel.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {novel.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA - Modernized */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          
          <div className="relative space-y-8 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              เปลี่ยนจินตนาการของคุณ<br />
              <span className="text-primary-500">เป็นผลงานที่สร้างรายได้</span>
            </h2>
            <p className="text-slate-400 text-lg">
              เข้าร่วมชุมชนนักเขียนกว่า 5,000+ คน และเริ่มสร้างสรรค์เรื่องราวของคุณตั้งแต่วันนี้
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/write"
                className="px-8 py-4 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20"
              >
                สมัครเป็นนักเขียน
              </Link>
              <Link
                href="/help/writer"
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                ดูรายละเอียดเพิ่มเติม
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
