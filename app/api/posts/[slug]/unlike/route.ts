import { auth } from '@/auth';
import { PostService } from '@/services/post-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized', data: null }, { status: 401 });
  }

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ success: false, error: 'Slug is required', data: null }, { status: 400 });
  }

  try {
    const userId = session.user?.id as string;
    const likeRes = await PostService.unlikePost(slug, userId);
    return NextResponse.json(likeRes);
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json({ success: false, error: 'Error liking post', data: null }, { status: 500 });
  }
}
