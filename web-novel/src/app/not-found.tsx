import Link from 'next/link';
import { Search, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="relative">
          <div className="absolute inset-0 bg-slate-200 rounded-full blur-3xl opacity-30 -z-10" />
          <div className="text-[12rem] font-black text-slate-100 leading-none select-none">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 bg-white shadow-2xl shadow-slate-200 rounded-[2.5rem] flex items-center justify-center border border-slate-50">
              <Search className="w-10 h-10 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">ไม่พบหน้าที่คุณต้องการ</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            หน้าเว็บที่คุณกำลังเรียกหาอาจจะถูกย้าย เปลี่ยนชื่อ หรือไม่มีอยู่อีกต่อไป
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Home className="w-5 h-5" />
            กลับไปหน้าหลัก
          </Link>
          <Link
            href="/novels"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-600 rounded-full font-bold hover:text-slate-900 transition-all"
          >
            ไปดูนิยายมาแรง
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
