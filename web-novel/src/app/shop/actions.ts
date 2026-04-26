'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { processTransaction } from '@/lib/financials';
import { revalidatePath } from 'next/cache';

export async function topUpCoins(packageId: number, coins: number, price: number) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนดำเนินการ');
  }

  const userId = (session.user as any).id;

  try {
    // In a real app, you would verify payment with a provider here
    await processTransaction(
      userId,
      coins,
      'TOP_UP',
      `เติมเหรียญแพ็คเกจ ${packageId} (฿${price})`,
      { packageId: String(packageId), price: String(price) }
    );
    
    revalidatePath('/shop');
    revalidatePath('/profile');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
