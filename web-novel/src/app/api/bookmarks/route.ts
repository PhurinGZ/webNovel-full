import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/bookmarks
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const bookmarks = await prisma.bookmark.findMany({
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
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(bookmarks);
}

// POST /api/bookmarks - Add or remove bookmark
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { novelId, action } = await req.json();

  const userId = (session.user as any).id;

  if (action === 'remove') {
    await prisma.bookmark.deleteMany({
      where: {
        userId,
        novelId,
      },
    });
    return NextResponse.json({ message: 'Bookmark removed' });
  }

  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        novelId,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Already bookmarked' }, { status: 400 });
    }
    throw error;
  }
}
