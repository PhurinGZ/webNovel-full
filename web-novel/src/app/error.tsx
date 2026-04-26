'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Global application error captured', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-100 rounded-full blur-3xl opacity-50 -z-10" />
          <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-primary-100">
            <AlertCircle className="w-10 h-10" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">เกิดข้อผิดพลาดขึ้น</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            ขออภัย ระบบเกิดปัญหาขัดข้องชั่วคราว ทีมงานได้รับทราบข้อมูลแล้วและกำลังดำเนินการแก้ไข
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
          >
            <RefreshCcw className="w-5 h-5" />
            ลองใหม่อีกครั้ง
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all"
          >
            <Home className="w-5 h-5" />
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
