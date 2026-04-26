import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, href, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {icon && <div className="text-primary-600">{icon}</div>}
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>
      {href && (
        <Link 
          href={href} 
          className="group flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          ดูทั้งหมด
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
