import { CommentService } from '@/services/comment-service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/comments/[id]/replies - Lấy replies của một comment với phân trang
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // Lấy các query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

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

    const response = await CommentService.getRepliesByCommentId({
      commentId: id,
      page,
      limit,
    });

    if (response.status === 'error') {
      const statusCode = response.message?.includes('Invalid commentId') ? 400 : 500;

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
      pagination: response.pagination,
      message: 'Replies retrieved successfully',
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/comments/[id]/replies:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve replies';

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
