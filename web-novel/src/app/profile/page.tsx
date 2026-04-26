import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { User, Mail, BookOpen, Bookmark, Coins, Settings, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          bookmarks: true,
          reviews: true,
          following: true,
          followers: true,
        },
      },
    },
  });

  const readingHistory = await prisma.readingHistory.findMany({
    where: { userId },
    include: {
      novel: { select: { title: true, coverImage: true, _count: { select: { chapters: true } } } },
      chapter: { select: { order: true, title: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      novel: {
        select: {
          title: true,
          coverImage: true,
          slug: true,
          categories: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      chapter: { select: { title: true, order: true } },
      novel: { select: { title: true, coverImage: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const coinBalance = user?.coins || 0;

  return {
    user,
    readingHistory,
    bookmarks,
    purchases,
    coinBalance,
  };
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">กรุณาเข้าสู่ระบบ</h1>
          <p className="text-gray-600">คุณต้องเข้าสู่ระบบเพื่อดูโปรไฟล์ของคุณ</p>
          <Link href="/auth/signin" className="mt-4 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  const { user, readingHistory, bookmarks, purchases, coinBalance } = await getUserData((session.user as any).id);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">ไม่พบผู้ใช้</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl border p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src={user.avatar || 'https://placehold.co/200x200/64748b/ffffff?text=User'}
              alt={user.name || 'User'}
              className="w-32 h-32 rounded-full"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.bio || 'ยังไม่มีข้อมูล'}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <p className="text-2xl font-semibold">{user._count.bookmarks}</p>
                <p className="text-sm text-gray-500">บุ๊คมาร์ค</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{user._count.reviews}</p>
                <p className="text-sm text-gray-500">รีวิว</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{user._count.following}</p>
                <p className="text-sm text-gray-500">กำลังติดตาม</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{coinBalance}</p>
                <p className="text-sm text-gray-500">เหรียญ</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Link href="/shop" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                เติมเหรียญ
              </Link>
              <Link href="/settings" className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                ตั้งค่า
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border mb-6">
        <div className="flex border-b">
          <Link href="#overview" className="flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium text-primary-600 border-b-2 border-primary-600">
            <User className="w-4 h-4" />
            ภาพรวม
          </Link>
          <Link href="#bookmarks" className="flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium text-gray-600 hover:text-gray-900">
            <Bookmark className="w-4 h-4" />
            บุ๊คมาร์ค
          </Link>
          <Link href="#history" className="flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium text-gray-600 hover:text-gray-900">
            <BookOpen className="w-4 h-4" />
            ประวัติการอ่าน
          </Link>
          <Link href="#purchases" className="flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium text-gray-600 hover:text-gray-900">
            <Coins className="w-4 h-4" />
            สิ่งที่ซื้อ
          </Link>
        </div>

        <div className="p-6">
          {/* Account Info */}
          <div id="overview" className="mb-8">
            <h2 className="text-lg font-semibold mb-4">ข้อมูลบัญชี</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <span>{user.role === 'AUTHOR' ? 'นักเขียน' : 'ผู้อ่าน'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <span>เข้าร่วมเมื่อ {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Reading History */}
          <div id="history" className="mb-8">
            <h2 className="text-lg font-semibold mb-4">ประวัติการอ่าน</h2>
            {readingHistory.length > 0 ? (
              <div className="space-y-4">
                {readingHistory.map((history) => {
                  const totalChapters = history.novel._count.chapters;
                  const progress = totalChapters > 0 ? Math.round((history.chapter.order / totalChapters) * 100) : 0;
                  return (
                    <div key={history.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={history.novel.coverImage || 'https://placehold.co/100x150/64748b/ffffff?text=Novel'}
                        alt={history.novel.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{history.novel.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {history.chapter.title}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{progress}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">ยังไม่มีประวัติการอ่าน</p>
            )}
          </div>

          {/* Bookmarks */}
          <div id="bookmarks" className="mb-8">
            <h2 className="text-lg font-semibold mb-4">บุ๊คมาร์ค</h2>
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarks.map((bookmark) => (
                  <Link
                    key={bookmark.id}
                    href={`/novel/${bookmark.novel.slug}`}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition"
                  >
                    <img
                      src={bookmark.novel.coverImage || 'https://placehold.co/100x150/64748b/ffffff?text=Novel'}
                      alt={bookmark.novel.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold mb-1">{bookmark.novel.title}</h3>
                      <p className="text-sm text-gray-500">
                        {bookmark.novel.categories.map((cat) => cat.name).join(', ')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">ยังไม่มีบุ๊คมาร์ค</p>
            )}
          </div>

          {/* Purchases */}
          <div id="purchases">
            <h2 className="text-lg font-semibold mb-4">สิ่งที่ซื้อ</h2>
            {purchases.length > 0 ? (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <Link
                    key={purchase.id}
                    href={`/novel/${purchase.novel.slug}`}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition"
                  >
                    <img
                      src={purchase.novel.coverImage || 'https://placehold.co/100x150/64748b/ffffff?text=Novel'}
                      alt={purchase.novel.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold mb-1">{purchase.novel.title}</h3>
                      <p className="text-sm text-gray-500">
                        {purchase.chapter?.title || 'ทั้งเรื่อง'}
                      </p>
                      <p className="text-xs text-gray-400">
                        ซื้อเมื่อ {formatDate(purchase.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">ยังไม่มีสิ่งที่ซื้อ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
