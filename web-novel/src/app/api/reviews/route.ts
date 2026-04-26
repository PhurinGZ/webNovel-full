import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST /api/reviews - Add review to novel
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { novelId, content } = await req.json();

  if (!novelId || !content) {
    return NextResponse.json(
      { error: 'Novel ID and content are required' },
      { status: 400 }
    );
  }

  const review = await prisma.review.create({
    data: {
      userId: (session.user as any).id,
      novelId,
      content,
    },
    include: {
      user: { select: { username: true, avatar: true } },
    },
  });

  return NextResponse.json(review, { status: 201 });
}

// GET /api/reviews
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const novelId = searchParams.get('novelId');

  if (!novelId) {
    return NextResponse.json({ error: 'Novel ID required' }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { novelId },
    include: {
      user: { select: { username: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return NextResponse.json(reviews);
}
