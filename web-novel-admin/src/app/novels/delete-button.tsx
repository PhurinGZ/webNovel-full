'use client';

import { Trash2 } from 'lucide-react';

interface DeleteNovelButtonProps {
  novelId: string;
  onDelete: (id: string) => Promise<void>;
}

export function DeleteNovelButton({ novelId, onDelete }: DeleteNovelButtonProps) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this novel? This action cannot be undone.')) {
      try {
        await onDelete(novelId);
      } catch (err: any) {
        alert('Failed to delete novel: ' + err.message);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
      title="Delete Novel"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
