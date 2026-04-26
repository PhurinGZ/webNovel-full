import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { 
  UserPlus, 
  UserMinus, 
  Shield, 
  Search,
  Mail,
  Calendar
} from 'lucide-react';

async function updateUserRole(id: string, role: any) {
  'use server';
  await prisma.user.update({
    where: { id },
    data: { role }
  });
  revalidatePath('/users');
}

export default async function UsersAdminPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      coins: true,
      createdAt: true,
      _count: {
        select: { novels: true }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Users</h1>
        <p className="text-slate-500 font-medium">Manage user accounts, roles, and permissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="admin-card">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Readers</div>
          <div className="text-3xl font-black text-slate-900">{users.filter(u => u.role === 'READER').length}</div>
        </div>
        <div className="admin-card">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Authors</div>
          <div className="text-3xl font-black text-slate-900">{users.filter(u => u.role === 'AUTHOR').length}</div>
        </div>
        <div className="admin-card">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Admins</div>
          <div className="text-3xl font-black text-slate-900">{users.filter(u => u.role === 'ADMIN').length}</div>
        </div>
      </div>

      <div className="admin-card overflow-hidden !p-0">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">User</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Role</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Activity</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Balance</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                      {user.username.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{user.username}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5" /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                    user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 
                    user.role === 'AUTHOR' ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-bold text-slate-700">{user._count.novels} Novels</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-2.5 h-2.5" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-black text-amber-600">{user.coins.toLocaleString()} Coins</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {user.role === 'READER' ? (
                      <form action={async () => {
                        'use server';
                        await updateUserRole(user.id, 'AUTHOR');
                      }}>
                        <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="Promote to Author">
                          <UserPlus className="w-5 h-5" />
                        </button>
                      </form>
                    ) : user.role === 'AUTHOR' ? (
                      <form action={async () => {
                        'use server';
                        await updateUserRole(user.id, 'READER');
                      }}>
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg" title="Demote to Reader">
                          <UserMinus className="w-5 h-5" />
                        </button>
                      </form>
                    ) : null}
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                      <Shield className="w-5 h-5" />
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
