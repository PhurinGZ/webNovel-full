'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Eye } from 'lucide-react';
import { getStorageUrl } from '@/lib/storage';

interface NovelCardProps {
  novel: {
    id: string;
    title: string;
    author: { username: string };
    coverImage: string | null;
    rating: number;
    views: number;
    isFree: boolean;
    price?: number | null;
  };
}

export function NovelCard({ novel }: NovelCardProps) {
  return (
    <Link
      href={`/novel/${novel.id}`}
      className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-100">
        <Image
          src={getStorageUrl(novel.coverImage, 'novel-cover')}
          alt={novel.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          {novel.isFree ? (
            <span className="text-[10px] font-black bg-white/90 backdrop-blur-md text-emerald-600 px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-100 shadow-sm">
              Free
            </span>
          ) : (
            <span className="text-[10px] font-black bg-white/90 backdrop-blur-md text-amber-600 px-2.5 py-1 rounded-full uppercase tracking-widest border border-amber-100 shadow-sm">
              {novel.price} Coins
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">
          {novel.title}
        </h3>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
          โดย {novel.author.username}
        </p>
        
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-50 rounded-full border border-yellow-100">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-[11px] font-black text-yellow-700">{novel.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            <span>{novel.views >= 1000 ? `${(novel.views / 1000).toFixed(1)}k` : novel.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
