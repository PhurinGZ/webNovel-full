import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { wordCount } from '@/lib/utils';

// POST /api/chapters - Create chapter
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { novelId, title, content, order, isFree, price } = body;

  if (!novelId || !title || !content) {
    return NextResponse.json(
      { error: 'Novel ID, title, and content are required' },
      { status: 400 }
    );
  }

  const userId = (session.user as any).id;

  // Verify user owns the novel
  const novel = await prisma.novel.findUnique({
    where: { id: novelId },
  });

  if (!novel || novel.authorId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const wc = wordCount(content);

  const chapter = await prisma.chapter.create({
    data: {
      novelId,
      title,
      content,
      order: order || 0,
      isFree: isFree || false,
      price: price || 0,
      wordCount: wc,
      publishedAt: new Date(),
    },
  });

  return NextResponse.json(chapter, { status: 201 });
}
