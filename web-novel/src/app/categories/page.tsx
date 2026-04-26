import Link from 'next/link';
import { BookOpen, TrendingUp } from 'lucide-react';

const categories: {
  name: string;
  slug: string;
  description: string;
  count: number;
  icon: string;
  color: string;
  topNovels: string[];
}[] = [
  {
    name: 'แฟนตาซี',
    slug: 'fantasy',
    description: 'โลกแห่งเวทมนตร์ การผจญภัย และสิ่งมหัศจรรย์',
    count: 1200,
    icon: '✨',
    color: 'from-purple-500 to-indigo-600',
    topNovels: ['แดนนักรบพิชิตฟ้า', 'จอมเวทสวรรค์', 'ตำนานมังกร'],
  },
  {
    name: 'โรแมนติก',
    slug: 'romance',
    description: 'เรื่องราวความรัก หวานซึ้ง ซาบซึ้งใจ',
    count: 980,
    icon: '💕',
    color: 'from-pink-500 to-rose-600',
    topNovels: ['รักนะ...เจ้าหญิง', 'คู่แท้พามาเลิฟ', 'รักนี้ไม่มีวันลืม'],
  },
  {
    name: 'ผจญภัย',
    slug: 'adventure',
    description: 'ออกเดินทางผจญภัยสู่ดินแดนใหม่',
    count: 750,
    icon: '🗺️',
    color: 'from-blue-500 to-cyan-600',
    topNovels: ['ไซอิ๋ว ฉบับใหม่', 'ล่าขุมทรัพย์สุดขอบฟ้า', 'ผจญภัยในป่าลึก'],
  },
  {
    name: 'กำลังภายใน',
    slug: 'martial-arts',
    description: 'วิทยายุทธ จอมยุทธ์ ยุทธภพ',
    count: 650,
    icon: '⚔️',
    color: 'from-red-500 to-orange-600',
    topNovels: ['ตำนานจอมยุทธ์', 'มังกรทลายฟ้า', 'กระบี่เดียวดาย'],
  },
  {
    name: 'สยองขวัญ',
    slug: 'horror',
    description: 'เรื่องลึกลับ สยองขวัญ ระทึกขวัญ',
    count: 450,
    icon: '👻',
    color: 'from-gray-600 to-gray-800',
    topNovels: ['บ้านวิญญาณหลอน', 'ความลับในสุสาน', 'คืนพระจันทร์เลือด'],
  },
  {
    name: 'ไซไฟ',
    slug: 'scifi',
    description: 'วิทยาศาสตร์ เทคโนโลยี อนาคต',
    count: 320,
    icon: '🚀',
    color: 'from-emerald-500 to-teal-600',
    topNovels: ['สงครามดวงดาว', 'AI รักของฉัน', 'โลกอนาคต 2200'],
  },
  {
    name: 'ตลก',
    slug: 'comedy',
    description: 'คอมเมดี้ ฮาๆ สนุกสนาน',
    count: 680,
    icon: '😂',
    color: 'from-yellow-500 to-amber-600',
    topNovels: ['ชีวิตฮาๆ ของนักเรียน', 'คู่หูป่วน ก๊วนฮา', 'ออฟฟิศฮาแตก'],
  },
  {
    name: 'ดราม่า',
    slug: 'drama',
    description: 'เรื่องราวชีวิต ซาบซึ้ง กินใจ',
    count: 520,
    icon: '🎭',
    color: 'from-indigo-500 to-purple-600',
    topNovels: ['ชีวิตไม่สมบูรณ์', 'น้ำตาในสายฝน', 'ความหวังสุดท้าย'],
  },
  {
    name: 'แอคชั่น',
    slug: 'action',
    description: 'ต่อสู้ ตื่นเต้น เร้าใจ',
    count: 580,
    icon: '💥',
    color: 'from-orange-500 to-red-600',
    topNovels: ['นักรบคนสุดท้าย', 'ล่าล้างโลก', 'ยุทธการเดือด'],
  },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">หมวดหมู่นิยาย</h1>
        <p className="text-gray-600">เลือกนิยายตามแนวที่คุณชอบ</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/novels?category=${cat.slug}`}
            className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group"
          >
            {/* Header with gradient */}
            <div className={`h-24 bg-gradient-to-r ${cat.color} p-4 flex items-center justify-between`}>
              <span className="text-4xl">{cat.icon}</span>
              <BookOpen className="w-6 h-6 text-white/80" />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600">
                {cat.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{cat.description}</p>
              <p className="text-sm text-gray-500 mb-4">{cat.count.toLocaleString()} เรื่อง</p>

              {/* Top novels */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  นิยายยอดนิยม
                </p>
                <ul className="space-y-1">
                  {cat.topNovels.map((novel: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 truncate">
                      {i + 1}. {novel}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
