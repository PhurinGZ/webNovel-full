import { notFound } from 'next/navigation';
import ReadPageClient from './read-page-client';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function ReadPage({ params }: { params: Promise<{ slug: string; chapterId: string }> }) {
  const { slug, chapterId } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user ? (session.user as any).id : null;

  // Fetch current chapter and novel details
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
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

  if (!chapter || (chapter.novel.slug !== slug && chapter.novel.id !== slug)) {
    notFound();
  }

  // Fetch previous and next chapters
  const prevChapter = await prisma.chapter.findFirst({
    where: {
      novelId: chapter.novelId,
      order: { lt: chapter.order },
      publishedAt: { not: null },
    },
    orderBy: { order: 'desc' },
    select: { id: true },
  });

  const nextChapter = await prisma.chapter.findFirst({
    where: {
      novelId: chapter.novelId,
      order: { gt: chapter.order },
      publishedAt: { not: null },
    },
    orderBy: { order: 'asc' },
    select: { id: true },
  });

  // Check if chapter is purchased
  let isPurchased = false;
  let userCoins = 0;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true },
    });
    userCoins = user?.coins || 0;

    if (chapter.isFree) {
      isPurchased = true;
    } else {
      const purchase = await prisma.purchase.findUnique({
        where: {
          purchase_unique: {
            userId,
            novelId: chapter.novelId,
            chapterId: chapter.id,
          },
        },
      });
      isPurchased = !!purchase || chapter.novel.authorId === userId;
    }
  } else {
    isPurchased = chapter.isFree;
  }

  return (
    <ReadPageClient
      slug={slug}
      chapterId={chapterId}
      initialChapter={chapter}
      prevChapterId={prevChapter?.id || null}
      nextChapterId={nextChapter?.id || null}
      isPurchased={isPurchased}
      userCoins={userCoins}
    />
  );
}
