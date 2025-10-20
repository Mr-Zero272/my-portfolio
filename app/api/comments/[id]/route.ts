import { CommentService } from '@/services/comment-service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from '../../auth/[...nextauth]/auth-config';

// GET /api/comments/[id] - Lấy comment theo ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // Lấy các query parameters
    const includeReplies = searchParams.get('includeReplies') !== 'false'; // default true
    const repliesPage = parseInt(searchParams.get('repliesPage') || '1');
    const repliesLimit = parseInt(searchParams.get('repliesLimit') || '10');

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

    const response = await CommentService.getCommentById(id, {
      includeReplies,
      repliesPage,
      repliesLimit,
    });

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
      message: 'Comment retrieved successfully',
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/comments/[id]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve comment';

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

// PUT /api/comments/[id] - Cập nhật comment
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authConfig);
    const { id } = await params;
    const body = await request.json();

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

    // Extract updateable fields and userId
    const { content, images } = body;

    if (!session?.user?.id?.toString()) {
      return NextResponse.redirect('/auth/signin');
      // return NextResponse.json(
      //   {
      //     success: false,
      //     error: 'User ID is required',
      //     data: null,
      //   },
      //   { status: 400 },
      // );
    }

    const updateData: { content?: string; images?: string[] } = {};

    if (content !== undefined) {
      updateData.content = content;
    }
    if (images !== undefined) {
      updateData.images = images;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid fields provided for update (content or images)',
          data: null,
        },
        { status: 400 },
      );
    }

    const response = await CommentService.updateComment(id, updateData, session.user.id.toString());

    if (response.status === 'error') {
      const statusCode = response.message?.includes('Comment not found')
        ? 404
        : response.message?.includes('can only update your own')
          ? 403
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
      message: 'Comment updated successfully',
    });
  } catch (error: unknown) {
    console.error('Error in PUT /api/comments/[id]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update comment';

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

// DELETE /api/comments/[id] - Xóa comment
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

    const response = await CommentService.deleteComment(id, userId);

    if (response.status === 'error') {
      const statusCode = response.message?.includes('Comment not found')
        ? 404
        : response.message?.includes('can only delete your own')
          ? 403
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
      data: null,
      message: 'Comment deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Error in DELETE /api/comments/[id]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete comment';

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
