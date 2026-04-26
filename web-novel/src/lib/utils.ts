export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, '-') // Keep Thai characters, English, and Numbers
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('th-TH').format(num);
}

export function wordCount(text: string): number {
  if (!text) return 0;
  // Thai language doesn't use spaces, so we estimate based on characters 
  // or use a more complex library. For now, we'll handle both.
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.length;
  return Math.ceil(text.length / 4); // Rough estimation for Thai
}

export function readingTime(wordCount: number): number {
  // Average reading speed: 200 words per minute
  return Math.ceil(wordCount / 200);
}
