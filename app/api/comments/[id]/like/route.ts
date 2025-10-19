import { CommentService } from '@/services/comment-service';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/comments/[id]/like - Like comment
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Comment ID is required',
          data: null,
        },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
          data: null,
        },
        { status: 400 },
      );
    }

    const response = await CommentService.likeComment(id, userId);

    if (response.status === 'error') {
      const statusCode = response.message?.includes('Comment not found')
        ? 404
        : response.message?.includes('Invalid')
          ? 400
          : 500;

      return NextResponse.json(
        {
          success: false,
          error: response.message,
          data: null,
        },
        { status: statusCode },
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data,
      message: 'Comment liked successfully',
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/comments/[id]/like:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to like comment';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        data: null,
      },
      { status: 500 },
    );
  }
}

// DELETE /api/comments/[id]/like - Unlike comment
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { userId } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Comment ID is required',
          data: null,
        },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
          data: null,
        },
        { status: 400 },
      );
    }

    const response = await CommentService.unlikeComment(id, userId);

    if (response.status === 'error') {
      const statusCode = response.message?.includes('Comment not found')
        ? 404
        : response.message?.includes('Invalid')
          ? 400
          : 500;

      return NextResponse.json(
        {
          success: false,
          error: response.message,
          data: null,
        },
        { status: statusCode },
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data,
      message: 'Comment unliked successfully',
    });
  } catch (error: unknown) {
    console.error('Error in DELETE /api/comments/[id]/like:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to unlike comment';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        data: null,
      },
      { status: 500 },
    );
  }
}
