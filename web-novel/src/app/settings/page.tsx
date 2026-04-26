'use client';

import { useState } from 'react';
import { User, Lock, Bell, ChevronLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function UserSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('บันทึกการตั้งค่าสำเร็จ');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">ตั้งค่าบัญชี</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold transition-all">
            <User className="w-5 h-5" />
            <span>โปรไฟล์</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all">
            <Lock className="w-5 h-5" />
            <span>ความปลอดภัย</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            <span>การแจ้งเตือน</span>
          </button>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6">ข้อมูลส่วนตัว</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200">
                  <User className="w-8 h-8 text-gray-300" />
                </div>
                <button className="px-4 py-2 text-sm font-bold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-all">
                  เปลี่ยนรูปโปรไฟล์
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">ชื่อที่แสดง</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none" placeholder="ระบุชื่อของคุณ" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">อีเมล</label>
                  <input type="email" disabled className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl text-sm font-bold text-gray-400 cursor-not-allowed outline-none" value="user@example.com" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">แนะนำตัวเอง</label>
                <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 outline-none resize-none" placeholder="เขียนคำแนะนำสั้นๆ เกี่ยวกับคุณ..." />
              </div>

              <div className="pt-4 border-t border-gray-50 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
