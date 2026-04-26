import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST /api/history - Update reading progress
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { novelId, chapterId, progress } = await req.json();

  const history = await prisma.readingHistory.upsert({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },
    update: {
      chapterId,
      progress: progress || 0,
      updatedAt: new Date(),
    },
    create: {
      userId,
      novelId,
      chapterId,
      progress: progress || 0,
    },
  });

  return NextResponse.json(history);
}

// GET /api/history - Get reading history
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const history = await prisma.readingHistory.findMany({
    where: { userId },
    include: {
      novel: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
        },
      },
      chapter: {
        select: {
          id: true,
          title: true,
          order: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 20,
  });

  return NextResponse.json(history);
}
