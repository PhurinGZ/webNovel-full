import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  PlusCircle,
  Search
} from 'lucide-react';

async function manualTopup(formData: FormData) {
  'use server';
  const email = formData.get('email') as string;
  const amount = parseInt(formData.get('amount') as string);
  const description = formData.get('description') as string || 'Admin manual top-up';

  if (!email || isNaN(amount)) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { coins: { increment: amount } }
    }),
    prisma.coinTransaction.create({
      data: {
        userId: user.id,
        amount: amount,
        type: 'TOP_UP',
        description: description
      }
    })
  ]);

  revalidatePath('/finance');
  revalidatePath('/users');
}

export default async function FinanceAdminPage() {
  const transactions = await prisma.coinTransaction.findMany({
    include: {
      user: { select: { username: true, email: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const stats = {
    totalCoins: await prisma.user.aggregate({ _sum: { coins: true } }),
    totalPurchases: await prisma.coinTransaction.count({ where: { type: 'PURCHASE' } }),
    totalTopups: await prisma.coinTransaction.count({ where: { type: 'TOP_UP' } })
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financials</h1>
        <p className="text-slate-500 font-medium">Track coin transactions and manage user balances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coins in Circulation</div>
          <div className="text-3xl font-black text-slate-900">{stats.totalCoins._sum.coins?.toLocaleString() || 0}</div>
        </div>
        <div className="admin-card">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Purchases</div>
          <div className="text-3xl font-black text-slate-900">{stats.totalPurchases}</div>
        </div>
        <div className="admin-card">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Top-ups</div>
          <div className="text-3xl font-black text-slate-900">{stats.totalTopups}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manual Top-up Form */}
        <div className="admin-card h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary-600" />
            Manual Top-up
          </h2>
          <form action={manualTopup} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">User Email</label>
              <input 
                name="email"
                type="email" 
                required
                placeholder="reader@example.com" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Amount (Coins)</label>
              <input 
                name="amount"
                type="number" 
                required
                placeholder="1000" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Reason</label>
              <input 
                name="description"
                type="text" 
                placeholder="Promotion bonus" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <button type="submit" className="admin-button-primary w-full py-3">
              Process Top-up
            </button>
          </form>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 admin-card overflow-hidden !p-0">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
            <History className="w-5 h-5 text-slate-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">User</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Type</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{tx.user.username}</div>
                      <div className="text-[10px] text-slate-400">{tx.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        tx.type === 'TOP_UP' ? 'bg-emerald-50 text-emerald-600' : 
                        tx.type === 'PURCHASE' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-black flex items-center gap-1 ${
                        tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {tx.amount > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                        {Math.abs(tx.amount).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">
                        {new Date(tx.createdAt).toLocaleString('th-TH')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
