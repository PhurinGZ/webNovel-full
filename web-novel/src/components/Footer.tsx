import Link from 'next/link';
import { BookOpen, Globe, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-primary-600 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Novel<span className="text-primary-600">Thai</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              แพลตฟอร์มนิยายออนไลน์ที่ทันสมัยที่สุด สำหรับนักเขียนและนักอ่านชาวไทย ร่วมสร้างสรรค์จินตนาการไปกับเรา
            </p>
            <div className="flex gap-4">
              <div className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 hover:text-white transition-all cursor-pointer">
                <Globe className="w-4 h-4" />
              </div>
              <div className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 hover:text-white transition-all cursor-pointer">
                <Mail className="w-4 h-4" />
              </div>
              <div className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 hover:text-white transition-all cursor-pointer">
                <Phone className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* For Readers */}
          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">สำหรับผู้อ่าน</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/novels" className="hover:text-primary-500 transition-colors">อ่านนิยายทั้งหมด</Link></li>
              <li><Link href="/categories" className="hover:text-primary-500 transition-colors">หมวดหมู่นิยาย</Link></li>
              <li><Link href="/ranking" className="hover:text-primary-500 transition-colors">อันดับยอดนิยม</Link></li>
              <li><Link href="/shop" className="hover:text-primary-500 transition-colors">เติมเหรียญทอง</Link></li>
            </ul>
          </div>

          {/* For Writers */}
          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">สำหรับนักเขียน</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/write" className="hover:text-primary-500 transition-colors">เริ่มเขียนนิยาย</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary-500 transition-colors">แผงควบคุมนักเขียน</Link></li>
              <li><Link href="/help/writer" className="hover:text-primary-500 transition-colors">คู่มือการใช้งาน</Link></li>
              <li><Link href="/monetization" className="hover:text-primary-500 transition-colors">การสร้างรายได้</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">ช่วยเหลือและนโยบาย</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/faq" className="hover:text-primary-500 transition-colors">คำถามที่พบบ่อย</Link></li>
              <li><Link href="/contact" className="hover:text-primary-500 transition-colors">ติดต่อทีมงาน</Link></li>
              <li><Link href="/terms" className="hover:text-primary-500 transition-colors">ข้อกำหนดการใช้งาน</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-500 transition-colors">นโยบายความเป็นส่วนตัว</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest">
          <p>&copy; 2024 NovelThai. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
