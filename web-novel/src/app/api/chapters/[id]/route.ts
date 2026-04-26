import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/chapters/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chapter = await prisma.chapter.findUnique({
    where: { id },
    include: {
      novel: {
        select: {
          id: true,
          title: true,
          slug: true,
          authorId: true,
        },
      },
    },
  });

  if (!chapter) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  return NextResponse.json(chapter);
}

// PUT /api/chapters/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const chapter = await prisma.chapter.findUnique({
    where: { id },
    include: { novel: true },
  });

  if (!chapter || chapter.novel.authorId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { title, content, isFree, price } = body;

  const updated = await prisma.chapter.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(content && { content, wordCount: content.split(/\s+/).filter(Boolean).length }),
      ...(isFree !== undefined && { isFree }),
      ...(price !== undefined && { price }),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/chapters/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const chapter = await prisma.chapter.findUnique({
    where: { id },
    include: { novel: true },
  });

  if (!chapter || chapter.novel.authorId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.chapter.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Chapter deleted' });
}
