import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

// GET /api/novels/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const novel = await prisma.novel.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, avatar: true, bio: true } },
      categories: true,
      chapters: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          order: true,
          isFree: true,
          price: true,
          wordCount: true,
          publishedAt: true,
        },
      },
      ratings: { select: { score: true } },
      reviews: {
        take: 10,
        include: {
          user: { select: { username: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!novel) {
    return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
  }

  // Increment views
  await prisma.novel.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json(novel);
}

// PUT /api/novels/[id]
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

  const novel = await prisma.novel.findUnique({
    where: { id },
  });

  if (!novel || novel.authorId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, categories, isFree, price, status } = body;

  const updatedNovel = await prisma.novel.update({
    where: { id },
    data: {
      ...(title && { title, slug: slugify(title) }),
      ...(description && { description }),
      ...(isFree !== undefined && { isFree }),
      ...(price !== undefined && { price }),
      ...(status && { status }),
      ...(categories && {
        categories: {
          set: categories.map((slug: string) => ({ slug })),
        },
      }),
    },
  });

  return NextResponse.json(updatedNovel);
}

// DELETE /api/novels/[id]
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

  const novel = await prisma.novel.findUnique({
    where: { id },
  });

  if (!novel || novel.authorId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.novel.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Novel deleted' });
}
