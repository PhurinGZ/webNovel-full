const DEFAULT_COVER = 'https://placehold.co/400x600/f8fafc/e2e8f0?text=NovelThai';
const DEFAULT_AVATAR = 'https://placehold.co/200x200/f1f5f9/94a3b8?text=User';

export type StorageType = 'novel-cover' | 'avatar';

export function getStorageUrl(path: string | null | undefined, type: StorageType): string {
  if (!path) {
    return type === 'novel-cover' ? DEFAULT_COVER : DEFAULT_AVATAR;
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `/uploads/${path}`;
}

export async function uploadFile(file: File, type: StorageType): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Upload failed');
  }

  const data = await res.json();
  return data.filename; // Returns only the filename for DB storage
}
