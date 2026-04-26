import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { slugify, wordCount } from '@/lib/utils';

// GET /api/novels - List novels with filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const isFree = searchParams.get('isFree');
  const search = searchParams.get('search');

  const skip = (page - 1) * limit;

  const where: any = { status: 'PUBLISHED' };

  if (category) {
    where.categories = { some: { slug: category } };
  }

  if (status) {
    where.status = status;
  }

  if (isFree === 'true') {
    where.isFree = true;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [novels, total] = await Promise.all([
    prisma.novel.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        categories: true,
      },
      orderBy: { views: 'desc' },
    }),
    prisma.novel.count({ where }),
  ]);

  return NextResponse.json({
    novels,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/novels - Create novel (auth required)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, categories, isFree, price } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: 'Title and description are required' },
      { status: 400 }
    );
  }

  const userId = (session.user as any).id;

  const novel = await prisma.novel.create({
    data: {
      title,
      slug: slugify(title),
      description,
      authorId: userId,
      isFree: isFree || false,
      price: price || 0,
      categories: categories ? {
        connect: categories.map((slug: string) => ({ slug })),
      } : undefined,
    },
  });

  return NextResponse.json(novel, { status: 201 });
}
