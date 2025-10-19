import { CommentService } from '@/services/comment-service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/comments/[id]/stats - Lấy thống kê like/dislike/replies của comment
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

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

    const response = await CommentService.getCommentStats(id);

    if (response.status === 'error') {
      const statusCode = response.message?.includes('Comment not found')
        ? 404
        : response.message?.includes('Invalid commentId')
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
      message: 'Comment stats retrieved successfully',
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/comments/[id]/stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve comment stats';

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
