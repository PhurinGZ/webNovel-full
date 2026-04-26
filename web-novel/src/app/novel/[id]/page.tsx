import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, Bookmark, Share2, Eye, BookOpen, Heart, MessageCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatDate, wordCount } from '@/lib/utils';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

async function getNovel(identifier: string) {
  // Try to find by slug first, then by id
  let novel = await prisma.novel.findUnique({
    where: { slug: identifier },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      categories: true,
      chapters: {
        where: { publishedAt: { not: null } },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          order: true,
          isFree: true,
          price: true,
          publishedAt: true,
          wordCount: true,
        },
      },
      reviews: {
        include: {
          user: { select: { name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: {
          reviews: true,
          bookmarks: true,
        },
      },
    },
  });

  // If not found by slug, try by id
  if (!novel) {
    novel = await prisma.novel.findUnique({
      where: { id: identifier },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        categories: true,
        chapters: {
          where: { publishedAt: { not: null } },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
            isFree: true,
            price: true,
            publishedAt: true,
            wordCount: true,
          },
        },
        reviews: {
          include: {
            user: { select: { name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            bookmarks: true,
          },
        },
      },
    });
  }

  if (!novel) return null;

  // Calculate average rating
  const ratings = await prisma.rating.findMany({
    where: { novelId: novel.id },
    select: { score: true },
  });

  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
    : 0;

  return {
    ...novel,
    avgRating,
    ratingCount: ratings.length,
  };
}

export default async function NovelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const novel = await getNovel(id);

  if (!novel) {
    notFound();
  }

  // Check if bookmarked
  let isBookmarked = false;
  if (session) {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_novelId: {
          userId: (session.user as any).id,
          novelId: novel.id,
        },
      },
    });
    isBookmarked = !!bookmark;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Novel Header */}
      <div className="bg-white rounded-xl border p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={novel.coverImage || 'https://placehold.co/400x600/dc2626/ffffff?text=No+Cover'}
            alt={novel.title}
            className="w-48 h-72 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>

            <div className="flex items-center gap-4 mb-4">
              <Link href={`/profile/${novel.author.id}`} className="flex items-center gap-2">
                <img
                  src={novel.author.avatar || 'https://placehold.co/100x100/64748b/ffffff?text=A'}
                  alt={novel.author.name || 'Author'}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-primary-600">{novel.author.name}</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{novel.avgRating.toFixed(1)}</span>
                <span className="text-gray-500">({novel.ratingCount} คะแนน)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{novel.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Heart className="w-4 h-4" />
                <span>{novel._count.bookmarks} ผู้ติดตาม</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {novel.categories.map((cat) => (
                <span key={cat.id} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {cat.name}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/read/${id}/${novel.chapters[0]?.id}`}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                อ่านเลย
              </Link>
              <button className="px-4 py-3 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Bookmark className="w-5 h-5" />
                เก็บ
              </button>
              <button className="px-4 py-3 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                แชร์
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h2 className="font-semibold mb-2">เรื่องย่อ</h2>
          <p className="text-gray-700 leading-relaxed">{novel.description}</p>
        </div>
      </div>

      {/* Chapters List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                ตอน ({novel.chapters.length} ตอน)
              </h2>
              <span className="text-sm text-gray-500">
                อัพเดทล่าสุด: {formatDate(novel.updatedAt)}
              </span>
            </div>

            <div className="space-y-2">
              {novel.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/read/${id}/${chapter.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-primary-500 hover:bg-primary-50 transition"
                >
                  <div>
                    <h3 className="font-medium">{chapter.title}</h3>
                    <p className="text-sm text-gray-500">
                      {chapter.wordCount.toLocaleString()} คำ
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {chapter.isFree ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">ฟรี</span>
                    ) : (
                      <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">
                        {chapter.price} เหรียญ
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Reviews */}
        <div>
          <div className="bg-white rounded-xl border p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              รีวิว ({novel.reviews.length})
            </h2>

            <div className="space-y-4">
              {novel.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={review.user.avatar || 'https://placehold.co/50x50/64748b/ffffff?text=R'}
                      alt={review.user.name || 'Reviewer'}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <span className="font-medium text-sm">{review.user.name}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{review.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
