'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Coins, 
  Settings, 
  LogOut,
  ShieldCheck,
  Tag
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Novels', href: '/novels', icon: BookOpen },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Finance', href: '/finance', icon: Coins },
  { label: 'Categories', href: '/categories', icon: Tag },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 p-6 flex flex-col">
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="text-xl font-black tracking-tighter text-slate-900">
          Admin<span className="text-primary-600">Panel</span>
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-slate-100">
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="sidebar-link w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
