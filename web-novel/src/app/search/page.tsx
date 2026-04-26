import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { Search, Filter, Star, Eye } from 'lucide-react';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    status?: string;
    sortBy?: string;
  };
}

async function SearchResults({ query }: { query: string }) {
  if (!query.trim()) {
    return null;
  }

  const searchResults = await prisma.novel.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { author: { name: { contains: query } } },
      ],
      status: { not: 'DRAFT' },
    },
    include: {
      author: { select: { name: true } },
      categories: true,
      _count: {
        select: {
          chapters: true,
          bookmarks: true,
        },
      },
    },
    orderBy: { views: 'desc' },
    take: 50,
  });

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">ไม่พบผลลัพธ์</h2>
        <p className="text-gray-600">ลองค้นหาด้วยคำค้นอื่น</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-600 mb-6">
        พบ {searchResults.length} รายการ สำหรับ "{query}"
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((novel) => {
          // Calculate average rating
          const avgRating = 0; // Would need to query ratings separately

          return (
            <Link
              key={novel.id}
              href={`/novel/${novel.slug}`}
              className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition flex"
            >
              <img
                src={novel.coverImage || 'https://placehold.co/200x300/64748b/ffffff?text=No+Cover'}
                alt={novel.title}
                className="w-28 h-40 object-cover"
              />
              <div className="p-4 flex-1">
                <h3 className="font-semibold mb-1 line-clamp-2">{novel.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{novel.author.name}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {novel.description}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{avgRating > 0 ? avgRating.toFixed(1) : 'ใหม่'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span>{novel.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <span>{novel._count.chapters} ตอน</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {novel.categories.slice(0, 2).map((cat) => (
                    <span key={cat.id} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchContent({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <form className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="ค้นหานิยาย ชื่อผู้แต่ง หรือคำสำคัญ..."
            className="w-full pl-12 pr-4 py-4 border-2 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            ค้นหา
          </button>
        </div>
      </form>

      {/* Search Results */}
      {query ? (
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังค้นหา...</p>
          </div>
        }>
          <SearchResults query={query} />
        </Suspense>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">ค้นหา</h2>
          <p className="text-gray-600">
            กรอกคำค้นเพื่อหานิยายที่คุณสนใจ
          </p>
        </div>
      )}

      {/* Popular Searches */}
      {!query && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">คำค้นหายอดนิยม</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'แฟนตาซี',
              'โรแมนติก',
              'พระเอกเก่ง',
              'นางเอกฉลาด',
              'ย้อนเวลา',
              'เวทมนตร์',
              'กำลังภายใน',
              'รักวัยรุ่น',
              'คอมเมดี้',
              'ดราม่า',
            ].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-sm"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center">กำลังโหลด...</div>}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}