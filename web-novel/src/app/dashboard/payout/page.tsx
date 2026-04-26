import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { 
  Coins, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';

async function requestPayout(formData: FormData) {
  'use server';
  const session = await getServerSession(authOptions);
  if (!session?.user) return;
  
  const userId = (session.user as any).id;
  const coins = parseInt(formData.get('coins') as string);
  const bankDetails = formData.get('bankDetails') as string;
  
  // Rate: 100 coins = 25 THB
  const amount = (coins / 100) * 25;

  await prisma.$transaction(async (tx) => {
    // 1. Deduct coins from balance
    const user = await tx.user.update({
      where: { id: userId },
      data: { coins: { decrement: coins } }
    });

    if (user.coins < 0) throw new Error('เหรียญไม่เพียงพอ');

    // 2. Create payout request
    await tx.payoutRequest.create({
      data: {
        userId,
        coins,
        amount,
        bankDetails,
        status: 'PENDING'
      }
    });

    // 3. Record transaction
    await tx.coinTransaction.create({
      data: {
        userId,
        amount: -coins,
        type: 'PURCHASE' as any, // Or a new type WITHDRAW
        description: 'ถอนเงินรางวัลนักเขียน'
      }
    });
  });

  revalidatePath('/dashboard/payout');
}

export default async function PayoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login');

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      payoutRequests: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) redirect('/');

  const totalEarnings = user.coins;
  const estimatedTHB = (totalEarnings / 100) * 25;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">รายได้และการถอนเงิน</h1>
        <p className="text-slate-500 font-medium">จัดการรายได้จากนิยายและส่งคำขอถอนเงิน</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Earnings Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-32 h-32" />
          </div>
          <div className="relative space-y-6">
            <div className="flex items-center gap-2 text-primary-400 font-bold uppercase tracking-widest text-xs">
              <Coins className="w-4 h-4" />
              <span>ยอดเหรียญสะสม</span>
            </div>
            <div>
              <div className="text-5xl font-black tabular-nums">{user.coins.toLocaleString()}</div>
              <div className="text-slate-400 font-medium mt-1">เหรียญทอง</div>
            </div>
            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">ประมาณค่าเป็นเงินบาท</div>
                <div className="text-2xl font-bold">฿{estimatedTHB.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Form */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary-600" />
            ส่งคำขอถอนเงิน
          </h2>
          <form action={requestPayout} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">จำนวนเหรียญที่ต้องการถอน</label>
              <input 
                name="coins"
                type="number" 
                min="1000"
                step="100"
                required
                placeholder="ขั้นต่ำ 1,000 เหรียญ" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">ข้อมูลบัญชีธนาคาร</label>
              <textarea 
                name="bankDetails"
                required
                placeholder="ชื่อธนาคาร, เลขที่บัญชี, ชื่อบัญชี" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all h-24 resize-none"
              />
            </div>
            <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
              ยืนยันการถอนเงิน
            </button>
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              * การถอนเงินจะใช้เวลาดำเนินการ 3-5 วันทำการ<br />
              * อัตราแลกเปลี่ยน 100 เหรียญ = 25 บาท
            </p>
          </form>
        </div>
      </div>

      {/* History */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-slate-400" />
          ประวัติการถอนเงิน
        </h2>
        
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm shadow-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">วันที่</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">เหรียญ</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">ยอดเงิน</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {user.payoutRequests.map((req) => (
                <tr key={req.id} className="text-sm">
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {req.coins.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-black text-primary-600">
                    ฿{req.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      req.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                      req.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' :
                      req.status === 'APPROVED' ? 'bg-blue-50 text-blue-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {req.status === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                      {req.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      {req.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {req.status}
                    </div>
                  </td>
                </tr>
              ))}
              {user.payoutRequests.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                    ยังไม่มีประวัติการถอนเงิน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
