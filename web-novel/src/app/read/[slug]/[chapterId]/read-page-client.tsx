'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Settings, List, Moon, Sun, Type, MessageSquare, Send, Coins, Lock } from 'lucide-react';

interface ReadPageClientProps {
  slug: string;
  chapterId: string;
  initialChapter: any;
  prevChapterId: string | null;
  nextChapterId: string | null;
  isPurchased: boolean;
  userCoins: number;
}

export default function ReadPageClient({ 
  slug, 
  chapterId, 
  initialChapter: chapter, 
  prevChapterId, 
  nextChapterId, 
  isPurchased: initialPurchased,
  userCoins: initialCoins
}: ReadPageClientProps) {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [comment, setComment] = useState('');
  const [isPurchased, setIsPurchased] = useState(initialPurchased);
  const [userCoins, setUserCoins] = useState(initialCoins);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [comments, setComments] = useState([
    { id: '1', user: { username: 'นักอ่านตัวยง', avatar: 'https://placehold.co/40x40/64748b/ffffff?text=R' }, content: 'สนุกมาก! รออ่านตอนต่อไป', createdAt: new Date('2024-01-02') },
    { id: '2', user: { username: 'แฟนนิยาย', avatar: 'https://placehold.co/40x40/64748b/ffffff?text=F' }, content: 'เนื้อเรื่องดี เขียนสนุก', createdAt: new Date('2024-01-03') },
  ]);

  const contentRef = useRef<HTMLDivElement>(null);

  const themeClasses = {
    light: 'bg-white text-gray-900',
    sepia: 'bg-amber-50 text-amber-900',
    dark: 'bg-gray-900 text-gray-100',
  };

  // Keyboard shortcuts and reading history
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (prevChapterId) router.push(`/read/${slug}/${prevChapterId}`);
          break;
        case 'ArrowRight':
          if (nextChapterId && isPurchased) router.push(`/read/${slug}/${nextChapterId}`);
          break;
        case 't':
        case 'T':
          setTheme(prev => prev === 'light' ? 'sepia' : prev === 'sepia' ? 'dark' : 'light');
          break;
        case '+':
        case '=':
          setFontSize(prev => Math.min(28, prev + 2));
          break;
        case '-':
          setFontSize(prev => Math.max(14, prev - 2));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Update reading history
    if (isPurchased) {
      fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novelId: chapter.novelId,
          chapterId: chapter.id,
          progress: 100,
        }),
      }).catch(err => console.error('Failed to update history:', err));
    }

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slug, prevChapterId, nextChapterId, isPurchased, chapter.id, chapter.novelId, router]);

  const handlePurchase = async () => {
    if (userCoins < chapter.price) {
      alert('เหรียญไม่เพียงพอ กรุณาเติมเหรียญก่อนครับ');
      router.push('/shop');
      return;
    }

    setIsPurchasing(true);
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novelId: chapter.novelId,
          chapterId: chapter.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsPurchased(true);
        setUserCoins(data.user.coins);
        alert('ซื้อตอนสำเร็จ! ขอให้สนุกกับการอ่านครับ');
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการซื้อ');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      user: {
        username: 'ฉัน',
        avatar: 'https://placehold.co/40x40/64748b/ffffff?text=Me',
      },
      content: comment,
      createdAt: new Date(),
    };

    setComments([...comments, newComment]);
    setComment('');
  };

  return (
    <div className={`min-h-screen ${themeClasses[theme]}`}>
      {/* Reader Toolbar */}
      <div className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b shadow-sm`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/novel/${slug}`} className="flex items-center gap-2 hover:opacity-70">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">กลับ</span>
            </Link>
            <h2 className="text-sm font-medium truncate max-w-xs">{chapter.novel.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Controls */}
            <div className="hidden md:flex items-center gap-2 border-r pr-4">
              <button
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Type className="w-4 h-4" />
                <span className="text-xs">-</span>
              </button>
              <span className="text-sm w-8 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Type className="w-5 h-5" />
                <span className="text-xs">+</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'sepia' : theme === 'sepia' ? 'dark' : 'light')}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Comments Toggle */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Settings Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Chapter List */}
            <button className="p-2 hover:bg-gray-100 rounded" onClick={() => setShowSidebar(true)}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reading Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter Title */}
        <h1 className="text-3xl font-bold mb-8 text-center">{chapter.title}</h1>

        {/* Content or Purchase Prompt */}
        {isPurchased ? (
          <div
            ref={contentRef}
            className="prose max-w-none"
            style={{ fontSize: `${fontSize}px`, lineHeight }}
          >
            {chapter.content.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="mb-4 text-justify leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border p-12 text-center my-12 shadow-sm">
            <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-accent-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">ตอนพรีเมียม</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              สนับสนุนนักเขียนเพื่ออ่านตอนชิ้นงานพรีเมียมนี้เพียง {chapter.price} เหรียญเท่านั้น
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handlePurchase}
                disabled={isPurchasing}
                className="px-10 py-4 bg-accent-600 text-white rounded-full font-bold hover:bg-accent-700 transition flex items-center gap-2 shadow-lg shadow-accent-100"
              >
                <Coins className="w-5 h-5" />
                {isPurchasing ? 'กำลังดำเนินการ...' : `ปลดล็อกด้วย ${chapter.price} เหรียญ`}
              </button>
              
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>เหรียญของคุณ: </span>
                <span className="font-bold text-accent-600 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {userCoins}
                </span>
                {userCoins < chapter.price && (
                  <Link href="/shop" className="text-primary-600 font-bold hover:underline ml-2">
                    เติมเหรียญ
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chapter Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t">
          {prevChapterId ? (
            <Link 
              href={`/read/${slug}/${prevChapterId}`}
              className="px-6 py-3 border rounded-lg hover:bg-gray-100 flex items-center gap-2 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>ตอนก่อนหน้า</span>
            </Link>
          ) : (
            <div className="w-32"></div>
          )}
          
          {nextChapterId ? (
            <Link 
              href={`/read/${slug}/${nextChapterId}`}
              className={`px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 transition ${!isPurchased ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <span>ตอนต่อไป</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="w-32"></div>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              ความคิดเห็น ({comments.length})
            </h2>

            {/* Comment Input */}
            <div className="mb-8 flex gap-3">
              <img
                src="https://placehold.co/40x40/64748b/ffffff?text=Me"
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="แสดงความคิดเห็น..."
                  className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500 outline-none"
                  rows={3}
                />
                <button
                  onClick={handleSubmitComment}
                  className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  ส่ง
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 p-4 border rounded-lg">
                  <img
                    src={c.user.avatar}
                    alt={c.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{c.user.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <p className="text-gray-700">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reading Settings Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" onClick={() => setShowSidebar(false)}>
          <div className={`w-80 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 h-full overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-6">ตั้งค่าการอ่าน</h3>

            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <p className="font-semibold mb-3">ธีม</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-3 rounded border flex flex-col items-center gap-1 ${
                      theme === 'light' ? 'border-primary-600 bg-primary-50' : ''
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                    <span className="text-xs">สว่าง</span>
                  </button>
                  <button
                    onClick={() => setTheme('sepia')}
                    className={`p-3 rounded border flex flex-col items-center gap-1 ${
                      theme === 'sepia' ? 'border-primary-600 bg-primary-50' : ''
                    }`}
                  >
                    <span className="text-lg">📜</span>
                    <span className="text-xs">ซีเปีย</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-3 rounded border flex flex-col items-center gap-1 ${
                      theme === 'dark' ? 'border-primary-600 bg-primary-50' : ''
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                    <span className="text-xs">มืด</span>
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <p className="font-semibold mb-3">ขนาดตัวอักษร</p>
                <div className="flex items-center gap-4">
                   <input
                    type="range"
                    min="14"
                    max="28"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-bold w-10">{fontSize}px</span>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <p className="font-semibold mb-3">ระยะห่างบรรทัด</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1.5"
                    max="2.5"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-bold w-10">{lineHeight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
