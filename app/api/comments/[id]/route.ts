import { CommentService } from '@/services/comment-service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/comments/[id] - Lấy comment theo ID
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

    const comment = await CommentService.getCommentById(id);

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Comment not found',
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: comment,
      message: 'Comment retrieved successfully',
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/comments/[id]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve comment';

    // Handle validation errors
    if (errorMessage.includes('Invalid commentId')) {
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          data: null,
        },
        { status: 400 },
      );
    }

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

    // Extract updateable fields
    const updateData: { content?: string; author?: string } = {};

    if (body.content !== undefined) {
      updateData.content = body.content;
    }
    if (body.author !== undefined) {
      updateData.author = body.author;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid fields provided for update (content or author)',
          data: null,
        },
        { status: 400 },
      );
    }

    const updatedComment = await CommentService.updateComment(id, updateData);

    if (!updatedComment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Comment not found',
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedComment,
      message: 'Comment updated successfully',
    });
  } catch (error: unknown) {
    console.error('Error in PUT /api/comments/[id]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update comment';

    // Handle validation errors
    if (errorMessage.includes('Invalid commentId') || errorMessage.includes('required')) {
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          data: null,
        },
        { status: 400 },
      );
    }

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

    const deleted = await CommentService.deleteComment(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Comment not found',
          data: null,
        },
        { status: 404 },
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

    // Handle validation errors
    if (errorMessage.includes('Invalid commentId') || errorMessage.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          data: null,
        },
        { status: 400 },
      );
    }

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
