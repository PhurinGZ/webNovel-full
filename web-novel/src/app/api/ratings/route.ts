import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST /api/ratings - Rate a novel
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { novelId, score } = await req.json();

  if (!novelId || !score || score < 1 || score > 5) {
    return NextResponse.json(
      { error: 'Novel ID and score (1-5) are required' },
      { status: 400 }
    );
  }

  const userId = (session.user as any).id;

  const rating = await prisma.rating.upsert({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },
    update: { score },
    create: {
      userId,
      novelId,
      score,
    },
  });

  // Update novel's average rating
  const ratings = await prisma.rating.findMany({
    where: { novelId },
  });

  const avgRating = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;

  await prisma.novel.update({
    where: { id: novelId },
    data: { rating: avgRating },
  });

  return NextResponse.json(rating);
}
