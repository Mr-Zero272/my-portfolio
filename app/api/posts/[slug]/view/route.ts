import connectDB from '@/lib/mongodb';
import { Post } from '@/models';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ message: 'Slug is required', success: false }, { status: 400 });
    }

    const post = await Post.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true });

    if (!post) {
      return NextResponse.json({ message: 'Post not found', success: false }, { status: 404 });
    }

    return NextResponse.json({ message: 'View count incremented', success: true, data: { views: post.views } });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json({ message: 'Internal server error', success: false }, { status: 500 });
  }
}
