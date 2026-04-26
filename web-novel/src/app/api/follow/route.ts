import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST /api/follow - Follow/unfollow a user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { followingId, action } = await req.json();

  if (!followingId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  if (followingId === userId) {
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
  }

  if (action === 'unfollow') {
    await prisma.follow.deleteMany({
      where: {
        followerId: userId,
        followingId,
      },
    });
    return NextResponse.json({ message: 'Unfollowed' });
  }

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: followingId,
        type: 'FOLLOW',
        title: 'มีผู้ติดตามใหม่',
        content: `${(session.user as any).username} เริ่มติดตามคุณแล้ว`,
      },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Already following' }, { status: 400 });
    }
    throw error;
  }
}

// GET /api/follow - Get followers/following
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // 'followers' or 'following'
  const targetUserId = searchParams.get('userId') || userId;

  if (type === 'followers') {
    const followers = await prisma.follow.findMany({
      where: { followingId: targetUserId },
      include: {
        follower: { select: { id: true, username: true, avatar: true, bio: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(followers);
  }

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: { select: { id: true, username: true, avatar: true, bio: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(following);
}
