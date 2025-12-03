import { auth } from '@/auth';
import { checkIsFollowing, getFollowCounts } from '@/services/follow-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: targetUserId } = await params;
    const session = await auth();

    let isFollowing = false;

    if (session && session.user) {
      const currentUserId = session.user.id;
      isFollowing = currentUserId ? await checkIsFollowing(currentUserId, targetUserId) : false;
    }

    const counts = await getFollowCounts(targetUserId);

    return NextResponse.json({
      success: true,
      data: {
        isFollowing,
        ...counts,
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/users/[id]/follow-status:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
