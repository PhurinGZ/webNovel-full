export interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  role: 'READER' | 'AUTHOR' | 'ADMIN';
  coins: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Novel {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  authorId: string;
  author: User;
  categories: Category[];
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'HIATUS';
  isFree: boolean;
  price: number;
  rating: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  novelId: string;
  title: string;
  content: string;
  order: number;
  isFree: boolean;
  price: number;
  wordCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  novelId: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  novelId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: string;
  userId: string;
  novelId: string;
  score: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  chapterId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
