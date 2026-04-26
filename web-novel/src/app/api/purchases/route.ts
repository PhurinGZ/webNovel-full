import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST /api/purchases - Purchase a novel or chapter
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const { novelId, chapterId } = await req.json();

  // Get user with current coins
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Get item to purchase
  let price: number;
  let description: string;

  if (chapterId) {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    if (chapter.isFree) {
      return NextResponse.json({ error: 'Chapter is free' }, { status: 400 });
    }

    price = Number(chapter.price);
    description = `Purchase chapter: ${chapter.title}`;
  } else if (novelId) {
    const novel = await prisma.novel.findUnique({
      where: { id: novelId },
    });

    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
    }

    if (novel.isFree) {
      return NextResponse.json({ error: 'Novel is free' }, { status: 400 });
    }

    price = Number(novel.price);
    description = `Purchase novel: ${novel.title}`;
  } else {
    return NextResponse.json({ error: 'Invalid purchase request' }, { status: 400 });
  }

  // Check if already purchased
  const existing = await prisma.purchase.findUnique({
    where: {
      purchase_unique: {
        userId,
        novelId,
        chapterId: chapterId || null,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: 'Already purchased' }, { status: 400 });
  }

  // Check balance
  if (user.coins < price) {
    return NextResponse.json(
      { error: 'Insufficient coins', required: price, current: user.coins },
      { status: 400 }
    );
  }

  // Process purchase
  const result = await prisma.$transaction(async (tx) => {
    // Deduct coins from buyer
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { coins: { decrement: price } },
    });

    // Add coins to author (platform takes 30%)
    const authorEarned = Math.floor(price * 0.7);
    
    // Get author ID
    let authorId: string | null = null;
    if (novelId) {
      const novel = await tx.novel.findUnique({ where: { id: novelId } });
      authorId = novel?.authorId || null;
    } else if (chapterId) {
      const chapter = await tx.chapter.findUnique({ 
        where: { id: chapterId },
        include: { novel: true }
      });
      authorId = chapter?.novel.authorId || null;
    }

    if (authorId) {
      await tx.user.update({
        where: { id: authorId },
        data: { coins: { increment: authorEarned } },
      });
    }

    // Create purchase record
    const purchase = await tx.purchase.create({
      data: {
        userId,
        novelId,
        chapterId: chapterId || null,
        price,
      },
    });

    // Record transactions
    const authorIdForTx = authorId || '';
    await tx.coinTransaction.createMany({
      data: [
        {
          userId,
          amount: -price,
          type: 'PURCHASE',
          description,
        },
        {
          userId: authorIdForTx,
          amount: authorEarned,
          type: 'EARN',
          description: `Sale: ${description}`,
        },
      ],
    });

    return { purchase, user: updatedUser };
  });

  return NextResponse.json(result);
}

// GET /api/purchases - User's purchase history
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      novel: { select: { id: true, title: true, slug: true, coverImage: true } },
      chapter: { select: { id: true, title: true, order: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(purchases);
}
