import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const chapterId = searchParams.get('chapterId');
  if (!chapterId) {
    return NextResponse.json({ error: 'Chapter ID required' }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { chapterId },
    include: {
      user: { select: { username: true, avatar: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { chapterId, content } = await req.json();
  if (!chapterId || !content) {
    return NextResponse.json(
      { error: 'Chapter ID and content are required' },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      userId,
      chapterId,
      content,
    },
    include: {
      user: { select: { username: true, avatar: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
