'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Upload, 
  Plus, 
  X, 
  Loader2, 
  ChevronLeft, 
  Settings, 
  Eye, 
  MessageSquare, 
  Coins, 
  BookOpen,
  BarChart3,
  Trash2,
  Check
} from 'lucide-react';
import { uploadFile } from '@/lib/storage';
import Link from 'next/link';

const categoriesList = [
  { name: 'แฟนตาซี', slug: 'fantasy' },
  { name: 'โรแมนติก', slug: 'romance' },
  { name: 'ผจญภัย', slug: 'adventure' },
  { name: 'สยองขวัญ', slug: 'horror' },
  { name: 'ไซไฟ', slug: 'scifi' },
  { name: 'ตลก', slug: 'comedy' },
  { name: 'กำลังภายใน', slug: 'martial-arts' },
  { name: 'ดราม่า', slug: 'drama' },
  { name: 'แอคชั่น', slug: 'action' }
];

export default function WriteNovelPage({ params }: { params: { id?: string } }) {
  const router = useRouter();
  const isEditing = !!params.id;

  // Novel States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  // Chapter States
  const [chapters, setChapters] = useState([
    { id: '1', title: 'ตอนที่ 1: บทนำ', content: '', order: 1, isFree: true }
  ]);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  
  // UI States
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const activeChapter = chapters[activeChapterIndex];

  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      setSelectedCategories(selectedCategories.filter(s => s !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const filename = await uploadFile(file, 'novel-cover');
      setCoverImage(filename);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const addChapter = () => {
    const newOrder = chapters.length + 1;
    setChapters([
      ...chapters,
      {
        id: `temp-${Date.now()}`,
        title: `ตอนที่ ${newOrder}`,
        content: '',
        order: newOrder,
        isFree: true
      }
    ]);
    setActiveChapterIndex(chapters.length);
  };

  const updateChapter = (field: string, value: any) => {
    const newChapters = [...chapters];
    newChapters[activeChapterIndex] = { ...newChapters[activeChapterIndex], [field]: value };
    setChapters(newChapters);
  };

  const deleteChapter = (index: number) => {
    if (chapters.length === 1) return;
    const newChapters = chapters.filter((_, i) => i !== index);
    setChapters(newChapters);
    setActiveChapterIndex(0);
  };

  const handleSave = async () => {
    if (!title || !description) {
      alert('กรุณากรอกชื่อนิยายและเรื่องย่อในส่วนการตั้งค่า');
      setShowSettings(true);
      return;
    }

    setIsSaving(true);
    try {
      // 1. Create or Update Novel
      const novelRes = await fetch(isEditing ? `/api/novels/${params.id}` : '/api/novels', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          categories: selectedCategories,
          isFree,
          price,
          status,
          coverImage,
        }),
      });

      if (!novelRes.ok) {
        const err = await novelRes.json();
        throw new Error(err.error || 'Failed to save novel');
      }

      const novel = await novelRes.json();
      const novelId = novel.id;

      // 2. Save Chapters
      for (const chapter of chapters) {
        await fetch('/api/chapters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            novelId,
            title: chapter.title,
            content: chapter.content,
            order: chapter.order,
            isFree: chapter.isFree,
          }),
        });
      }

      setLastSaved(new Date());
      alert('บันทึกผลงานทั้งหมดเรียบร้อยแล้ว!');
      if (!isEditing) router.push(`/novel/${novelId}`);
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b sticky top-0 z-50 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="h-6 w-[1px] bg-gray-200"></div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
              {title || 'ไม่ได้ระบุชื่อเรื่อง'}
            </h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
              {status === 'DRAFT' ? 'Draft Mode' : 'Live on Platform'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-xs text-green-600 font-medium hidden md:flex items-center gap-1">
              <Check className="w-3 h-3" />
              บันทึกล่าสุด {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition ${showSettings ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-primary-600 text-white rounded-full font-bold text-sm hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary-100 transition-all active:scale-95"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'อัปเดตงานเขียน' : 'เผยแพร่นิยาย'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Chapter List */}
        <aside className="w-72 bg-white border-r flex flex-col hidden lg:flex">
          <div className="p-4 border-b bg-gray-50/50">
            <button 
              onClick={addChapter}
              className="w-full py-2.5 bg-white border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              เพิ่มตอนใหม่
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chapters.map((ch, idx) => (
              <div 
                key={ch.id}
                className={`group relative flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                  activeChapterIndex === idx 
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'hover:bg-gray-50 text-gray-600'
                }`}
                onClick={() => setActiveChapterIndex(idx)}
              >
                <div className={`w-1.5 h-1.5 rounded-full mr-3 ${activeChapterIndex === idx ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{ch.title}</p>
                  <p className="text-[10px] opacity-60">ตอนที่ {ch.order} • {wordCount(ch.content)} คำ</p>
                </div>
                {chapters.length > 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteChapter(idx); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-100 hover:text-rose-600 rounded-md transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Novel Stats Summary */}
          <div className="p-4 border-t bg-gray-50/50">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">ยอดวิว</p>
                <p className="text-sm font-black text-gray-900">0</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">เหรียญ</p>
                <p className="text-sm font-black text-accent-600">0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content: Editor */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-6 py-12 min-h-full flex flex-col">
            {/* Editor Header */}
            <div className="mb-8 space-y-4">
              <input
                type="text"
                value={activeChapter?.title || ''}
                onChange={(e) => updateChapter('title', e.target.value)}
                placeholder="ระบุชื่อตอนที่นี่..."
                className="w-full text-4xl font-black text-gray-900 placeholder:text-gray-200 outline-none border-none focus:ring-0"
              />
              <div className="flex items-center gap-6 pb-4 border-b">
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <BookOpen className="w-4 h-4" />
                  <span>{wordCount(activeChapter?.content || '')} คำ</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={!activeChapter?.isFree} 
                      onChange={(e) => updateChapter('isFree', !e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm font-bold text-gray-500 group-hover:text-primary-600">ตั้งเป็นตอนพรีเมียม</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Writing Area */}
            <textarea
              value={activeChapter?.content || ''}
              onChange={(e) => updateChapter('content', e.target.value)}
              placeholder="ปลดปล่อยจินตนาการของคุณที่นี่..."
              className="flex-1 w-full text-lg leading-[2] text-gray-700 placeholder:text-gray-200 outline-none border-none focus:ring-0 resize-none font-serif min-h-[500px]"
            />
          </div>
        </main>

        {/* Right Sidebar: Settings & Meta (Conditional) */}
        {showSettings && (
          <aside className="w-96 bg-white border-l overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-6 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">ตั้งค่าผลงาน</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Cover Upload */}
              <div className="space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">ปกนิยาย</p>
                <label className="relative block aspect-[2/3] w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden group cursor-pointer hover:border-primary-400 transition-all">
                  {coverImage ? (
                    <img src={`/uploads/${coverImage}`} className="w-full h-full object-cover" alt="Cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8 mb-2" />}
                      <span className="text-xs font-bold">อัปโหลดรูปปก</span>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              {/* Basic Info */}
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">ชื่อเรื่อง</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none" 
                    placeholder="ระบุชื่อเรื่องนิยาย"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">เรื่องย่อ</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 outline-none resize-none" 
                    placeholder="เขียนคำโปรยให้น่าสนใจ..."
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">หมวดหมู่</label>
                  <div className="flex flex-wrap gap-2">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => toggleCategory(cat.slug)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          selectedCategories.includes(cat.slug)
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monetization */}
              <div className="p-5 bg-accent-50 rounded-2xl border border-accent-100 space-y-4">
                <h4 className="text-sm font-black text-accent-700 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  การสร้างรายได้
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-accent-600">เปิดขายพรีเมียม</span>
                  <button 
                    onClick={() => setIsFree(!isFree)}
                    className={`w-12 h-6 rounded-full relative transition-all ${!isFree ? 'bg-accent-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${!isFree ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
                {!isFree && (
                  <div className="animate-in fade-in zoom-in duration-200">
                    <label className="text-[10px] font-black text-accent-400 uppercase block mb-1">ราคาปลดล็อกทั้งเรื่อง (เหรียญ)</label>
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(parseInt(e.target.value))}
                      className="w-full px-4 py-2 bg-white border-none rounded-lg text-sm font-bold text-accent-700 outline-none focus:ring-2 focus:ring-accent-500/20" 
                    />
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setStatus(status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT')}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    status === 'PUBLISHED' 
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  {status === 'PUBLISHED' ? 'ยกเลิกการเผยแพร่' : 'เปลี่ยนสถานะเป็นพร้อมเผยแพร่'}
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Stats Bar (Bottom - Tablet/Mobile) */}
      <footer className="lg:hidden bg-white border-t px-6 py-3 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase">คำ</p>
              <p className="text-sm font-black text-gray-900">{wordCount(activeChapter?.content || '')}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase">ตอน</p>
              <p className="text-sm font-black text-gray-900">{chapters.length}</p>
            </div>
         </div>
         <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 text-primary-600 font-bold text-sm">
            <BarChart3 className="w-4 h-4" />
            สถิติ
         </button>
      </footer>
    </div>
  );
}
