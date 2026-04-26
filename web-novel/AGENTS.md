# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

**NovelThai** - A comprehensive web novel platform built with Next.js 14 (App Router) + TypeScript + Tailwind CSS.

Features:
- Read novels with customizable reader (font size, theme, line height)
- Write and publish novels (author dashboard)
- Sell novels via coin system
- User profiles, bookmarks, reading history
- Reviews, ratings, comments
- Ranking system
- Categories and search

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database commands
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Create and apply migration
npx prisma db push           # Push schema to database (dev only)
npx prisma studio            # Open Prisma Studio (database GUI)
```

**Default port:** 3000

## Architecture

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js (Credentials provider)
- **Icons:** Lucide React

### Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Auth pages (login, register)
│   ├── novel/[id]/          # Novel detail page
│   ├── novels/              # Novel listing
│   ├── read/[slug]/[chapterId]/  # Reader page
│   ├── write/               # Author dashboard & editor
│   ├── dashboard/           # Writer dashboard
│   ├── profile/             # User profile
│   ├── ranking/             # Rankings
│   └── api/auth/[...nextauth]/  # NextAuth API
├── components/              # React components (Header, Footer)
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   └── utils.ts             # Utility functions
└── types/
    └── index.ts             # TypeScript interfaces

prisma/
└── schema.prisma            # Database schema
```

### Database Schema

**Core Models:**
- `User` - Users with roles (READER, AUTHOR, ADMIN), coin balance
- `Novel` - Novels with status (DRAFT, PUBLISHED, COMPLETED, HIATUS), pricing
- `Chapter` - Novel chapters with content, free/paid per chapter
- `Category` - Novel categories (many-to-many)
- `Bookmark` - User bookmarks (user + novel)
- `Purchase` - Purchase records (novel or chapter level)
- `CoinTransaction` - Coin history (PURCHASE, EARN, TOP_UP, REFUND)
- `Rating` - User ratings (1-5 per novel)
- `Review` - Text reviews on novels
- `Comment` - Comments on chapters

### Key Patterns

**Authentication:**
- NextAuth.js with JWT session strategy
- Custom session includes: id, role, coins
- Sign-in page: `/auth/login`
- Protected routes: check session in server components

**Reader Features:**
- Font size control (14-28px)
- Three themes: light, sepia, dark
- Line height adjustment
- Chapter sidebar navigation
- Mobile responsive

**Author Features:**
- Create/edit novels with cover upload
- Chapter editor with rich text
- Draft/Publish workflow
- Set free or paid pricing
- Dashboard with stats (views, followers, earnings)

**Coin System:**
- Users start with 100 coins
- Can buy entire novel or individual chapters
- Authors earn coins from purchases
- Transaction history tracked

## Important Notes

- Mock data is used throughout until database is connected
- Cover images use placeholder URLs
- Database URL must be set in `.env` file
- NEXTAUTH_SECRET must be set in `.env` for production
- No payment gateway integration yet (coin top-up is manual)
- Prisma schema uses PostgreSQL; change provider for other databases
- Font: Inter + Noto Sans Thai for Thai language support

## Environment Variables

Required in `.env`:
```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```
