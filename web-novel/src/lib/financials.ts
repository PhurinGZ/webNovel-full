import { prisma } from './prisma';
import { TransactionType } from '@prisma/client';

export interface TransactionMetadata {
  novelId?: string;
  chapterId?: string;
  packageId?: string;
  reason?: string;
}

/**
 * Core utility to process coin transactions atomically.
 */
export async function processTransaction(
  userId: string,
  amount: number,
  type: TransactionType,
  description: string,
  metadata?: TransactionMetadata
) {
  return await prisma.$transaction(async (tx) => {
    // 1. Get current user with lock (if supported by DB, in SQLite it locks the whole DB)
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, coins: true }
    });

    if (!user) throw new Error('ไม่พบผู้ใช้งาน');

    // 2. Prevent negative balance
    const newBalance = user.coins + amount;
    if (newBalance < 0) {
      throw new Error('ยอดเหรียญของคุณไม่เพียงพอสำหรับการดำเนินการนี้');
    }

    // 3. Update user balance
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { coins: newBalance },
    });

    // 4. Record transaction ledger
    const transaction = await tx.coinTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return { user: updatedUser, transaction };
  });
}

/**
 * Process a purchase where a reader pays and an author earns.
 * This is a critical production function that ensures both parties are updated correctly.
 */
export async function processPurchase(
  readerId: string,
  amount: number,
  novelId: string,
  chapterId?: string
) {
  return await prisma.$transaction(async (tx) => {
    // 1. Validate Item and Author
    const novel = await tx.novel.findUnique({
      where: { id: novelId },
      select: { authorId: true, title: true }
    });
    if (!novel) throw new Error('ไม่พบนิยาย');

    // 2. Reader spends coins
    const reader = await tx.user.findUnique({ where: { id: readerId } });
    if (!reader || reader.coins < amount) throw new Error('ยอดเหรียญไม่เพียงพอ');

    await tx.user.update({
      where: { id: readerId },
      data: { coins: { decrement: amount } },
    });

    // 3. Author earns coins (70% share)
    const authorShare = Math.floor(amount * 0.7);
    await tx.user.update({
      where: { id: novel.authorId },
      data: { coins: { increment: authorShare } },
    });

    // 4. Create purchase record
    const purchase = await tx.purchase.create({
      data: {
        userId: readerId,
        novelId,
        chapterId: chapterId || null,
        price: amount,
      },
    });

    // 5. Record transactions for both parties
    await tx.coinTransaction.createMany({
      data: [
        {
          userId: readerId,
          amount: -amount,
          type: 'PURCHASE',
          description: `ซื้อ${chapterId ? 'ตอน' : 'นิยาย'}: ${novel.title}`,
          metadata: JSON.stringify({ novelId, chapterId }),
        },
        {
          userId: novel.authorId,
          amount: authorShare,
          type: 'EARN',
          description: `รายได้จาก${chapterId ? 'ตอน' : 'นิยาย'}: ${novel.title}`,
          metadata: JSON.stringify({ novelId, chapterId, fromUser: readerId }),
        },
      ],
    });

    return { purchase };
  });
}
