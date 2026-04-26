import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getStorageUrl } from '@/lib/storage';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { DeleteNovelButton } from './delete-button';

async function updateNovelStatus(id: string, status: any) {
  'use server';
  await prisma.novel.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/novels');
  revalidatePath('/');
}

async function deleteNovel(id: string) {
  'use server';
  await prisma.novel.delete({
    where: { id }
  });
  revalidatePath('/novels');
}

export default async function NovelsAdminPage() {
  const novels = await prisma.novel.findMany({
    include: {
      author: { select: { username: true, email: true } },
      categories: { select: { name: true } },
      _count: { select: { chapters: true, reviews: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Novels</h1>
          <p className="text-slate-500 font-medium">Manage and moderate all content on the platform.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search novels..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="admin-card overflow-hidden !p-0">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Novel</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Author</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Categories</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {novels.map((novel) => (
              <tr key={novel.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-14 bg-slate-100 rounded-lg flex-shrink-0 border border-slate-100 overflow-hidden relative">
                      <Image 
                        src={getStorageUrl(novel.coverImage, 'novel-cover')} 
                        alt={novel.title}
                        fill
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{novel.title}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">ID: {novel.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="font-semibold text-slate-700">{novel.author.username}</div>
                  <div className="text-[10px] text-slate-400">{novel.author.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {novel.categories.map(cat => (
                      <span key={cat.name} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                    novel.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : 
                    novel.status === 'DRAFT' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {novel.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <form action={async () => {
                      'use server';
                      await updateNovelStatus(novel.id, novel.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED');
                    }}>
                      <button className={`p-2 rounded-lg transition-colors ${
                        novel.status === 'PUBLISHED' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                      }`} title={novel.status === 'PUBLISHED' ? 'Reject/Draft' : 'Approve/Publish'}>
                        {novel.status === 'PUBLISHED' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      </button>
                    </form>
                    
                    <DeleteNovelButton novelId={novel.id} onDelete={deleteNovel} />

                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
