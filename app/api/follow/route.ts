import { auth } from '@/auth';
import { checkIsFollowing, followUser, unfollowUser } from '@/services/follow-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId } = await request.json();
    if (!targetUserId) {
      return NextResponse.json({ success: false, message: 'Target user ID is required' }, { status: 400 });
    }

    const followerId = session.user.id;

    if (!followerId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Check if already following
    const isFollowing = followerId ? await checkIsFollowing(followerId, targetUserId) : false;

    if (isFollowing) {
      // Unfollow
      const result = await unfollowUser(followerId, targetUserId);
      return NextResponse.json({ ...result, isFollowing: false });
    } else {
      // Follow
      const result = await followUser(followerId, targetUserId);
      return NextResponse.json({ ...result, isFollowing: true });
    }
  } catch (error: any) {
    console.error('Error in POST /api/follow:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
