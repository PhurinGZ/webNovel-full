import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Coins, 
  ArrowUpRight, 
  Clock 
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function Dashboard() {
  const stats = [
    { 
      label: 'Total Revenue', 
      value: '฿ 45,200', 
      change: '+12.5%', 
      icon: Coins, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      label: 'Total Novels', 
      value: (await prisma.novel.count()).toLocaleString(), 
      change: '+4.3%', 
      icon: BookOpen, 
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Total Authors', 
      value: (await prisma.user.count({ where: { role: 'AUTHOR' } })).toLocaleString(), 
      change: '+2.1%', 
      icon: Users, 
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      label: 'Active Readers', 
      value: (await prisma.user.count({ where: { role: 'READER' } })).toLocaleString(), 
      change: '+8.4%', 
      icon: TrendingUp, 
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
  ];

  const recentNovels = await prisma.novel.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { username: true } } }
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.change}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 admin-card">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Recent Submissions</h2>
            <button className="text-sm font-bold text-primary-600 hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {recentNovels.map((novel) => (
              <div key={novel.id} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  {novel.coverImage && <img src={novel.coverImage} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{novel.title}</div>
                  <div className="text-xs text-slate-500 font-medium">by {novel.author.username}</div>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                    novel.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {novel.status}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase">{new Date(novel.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Activity</h2>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-primary-500 before:rounded-full before:z-10 after:absolute after:left-[3px] after:top-4 after:w-0.5 after:h-full after:bg-slate-100 last:after:hidden">
                <div className="text-sm font-bold text-slate-900">New user registration</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">System automatically verified the email for <span className="text-slate-900 font-bold">user_{i}@example.com</span></p>
                <div className="text-[10px] text-slate-400 mt-2 font-bold">2 MINUTES AGO</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
