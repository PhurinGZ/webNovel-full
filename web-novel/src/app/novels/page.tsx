import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { NovelCard } from '@/components/NovelCard';
import { SectionHeader } from '@/components/SectionHeader';

export default async function NovelsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ category?: string; status?: string; isFree?: string; search?: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const where: any = { status: 'PUBLISHED' };

  if (searchParams.category) {
    where.categories = { some: { slug: searchParams.category } };
  }

  if (searchParams.status) {
    where.status = searchParams.status;
  }

  if (searchParams.isFree === 'true') {
    where.isFree = true;
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
    ];
  }

  const novels = await prisma.novel.findMany({
    where,
    include: {
      author: { select: { username: true } },
      categories: true,
      chapters: { select: { id: true } },
    },
    orderBy: { views: 'desc' },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="นิยายทั้งหมด" />
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 sticky top-24 shadow-sm shadow-slate-100">
            <h2 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">หมวดหมู่</h2>
            <nav className="space-y-1">
              <Link 
                href="/novels" 
                className={`block px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  !searchParams.category ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                ทั้งหมด
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/novels?category=${cat.slug}`}
                  className={`block px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    searchParams.category === cat.slug ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Novel Grid */}
        <div className="flex-1">
          {novels.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {novels.map((novel) => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium italic">ไม่พบนิยายที่ค้นหาในขณะนี้</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
