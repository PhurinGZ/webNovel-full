import Link from 'next/link';
import { Star, Eye, Trophy, TrendingUp, Heart } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function RankingPage() {
  const novels = await prisma.novel.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      author: { select: { username: true } },
      bookmarks: true,
    },
    orderBy: { views: 'desc' },
    take: 20,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          จัดอันดับนิยาย
        </h1>
        <p className="text-gray-600">นิยายยอดนิยม (ตามยอดอ่าน)</p>
      </div>

      {/* Ranking List */}
      <div className="space-y-4">
        {novels.map((novel, index) => (
          <Link
            key={novel.id}
            href={`/novel/${novel.id}`}
            className="bg-white rounded-xl border p-6 hover:shadow-lg transition flex items-center gap-6"
          >
            {/* Rank Number */}
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                index === 0 ? 'text-yellow-500' :
                index === 1 ? 'text-gray-400' :
                index === 2 ? 'text-amber-600' :
                'text-gray-600'
              }`}>
                {index + 1}
              </div>
            </div>

            {/* Cover */}
            <img
              src={novel.coverImage || 'https://placehold.co/100x150/64748b/ffffff?text=No+Cover'}
              alt={novel.title}
              className="w-20 h-28 object-cover rounded-lg"
            />

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{novel.title}</h3>
              <p className="text-gray-600 mb-2">{novel.author.username}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{novel.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span>{novel.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>{novel.bookmarks.length} บุ๊คมาร์ค</span>
                </div>
              </div>
            </div>

            {/* Trend */}
            <div className="hidden md:block">
              {index < 3 ? (
                <TrendingUp className="w-6 h-6 text-green-500" />
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
