'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BookOpen, Menu, X, Search, User, PenTool, Coins } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition-colors">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Novel<span className="text-primary-600">Thai</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'หน้าแรก', href: '/' },
              { label: 'นิยาย', href: '/novels' },
              { label: 'หมวดหมู่', href: '/categories' },
              { label: 'จัดอันดับ', href: '/ranking' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหานิยายที่น่าสนใจ..."
                className="pl-10 pr-4 py-2 w-64 text-sm bg-slate-100 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </form>
            
            <div className="h-6 w-px bg-slate-200 mx-2" />

            <Link href="/shop" className="p-2 text-slate-500 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-all" title="เติมเหรียญ">
              <Coins className="w-5 h-5" />
            </Link>

            <Link href="/dashboard" className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all" title="สตูดิโอจัดการนิยาย">
              <PenTool className="w-5 h-5" />
            </Link>

            <NotificationBell />

            <Link href="/profile" className="flex items-center gap-2 p-1 pl-1 pr-3 border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
              <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-xs font-semibold text-slate-700">บัญชี</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-slate-100 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleSearch} className="mb-6 px-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหา..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-sm"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1 px-4">
              {[
                { label: 'หน้าแรก', href: '/' },
                { label: 'นิยาย', href: '/novels' },
                { label: 'หมวดหมู่', href: '/categories' },
                { label: 'จัดอันดับ', href: '/ranking' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-4 h-px bg-slate-100" />
              <Link href="/shop" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
                <Coins className="w-5 h-5" />
                <span>เติมเหรียญ</span>
              </Link>
              <Link href="/write" className="flex items-center gap-3 px-4 py-3 mt-2 bg-slate-900 text-white rounded-2xl font-bold justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                <PenTool className="w-4 h-4" />
                <span>เริ่มเขียนนิยาย</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
