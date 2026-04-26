import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { 
  Plus, 
  Trash2, 
  Tag,
  Hash
} from 'lucide-react';

async function createCategory(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  
  await prisma.category.create({
    data: { name, slug }
  });
  revalidatePath('/categories');
}

async function deleteCategory(id: string) {
  'use server';
  await prisma.category.delete({
    where: { id }
  });
  revalidatePath('/categories');
}

export default async function CategoriesAdminPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { novels: true } }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Categories</h1>
        <p className="text-slate-500 font-medium">Manage novel genres and classification tags.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Category */}
        <div className="admin-card h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-600" />
            Add Category
          </h2>
          <form action={createCategory} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category Name</label>
              <input 
                name="name"
                type="text" 
                required
                placeholder="e.g. Fantasy, Romance" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
            <button type="submit" className="admin-button-primary w-full py-3">
              Create Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 admin-card overflow-hidden !p-0">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Name</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Slug</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Novels</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Tag className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Hash className="w-3 h-3" />
                      {cat.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {cat._count.novels}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={async () => {
                      'use server';
                      await deleteCategory(cat.id);
                    }}>
                      <button 
                        disabled={cat._count.novels > 0}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title={cat._count.novels > 0 ? "Cannot delete category with novels" : "Delete category"}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
