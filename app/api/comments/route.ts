import { CommentService } from '@/services/comment-service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/comments - Lấy tất cả comments với phân trang
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const postId = searchParams.get('postId');
    const search = searchParams.get('search');

    let result;

    if (search) {
      // Tìm kiếm comments
      const commentsRes = await CommentService.searchComments({
        searchTerm: search,
        postId: postId || undefined,
        page,
        limit,
      });
      result = commentsRes;
    } else if (postId) {
      // Lấy comments của post cụ thể
      const commentsRes = await CommentService.getCommentsByPostId({ postId });
      result = commentsRes;
    } else {
      // Lấy tất cả comments với phân trang
      result = await CommentService.getAllComments(page, limit);
    }

    return NextResponse.json({
      ...result,
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/comments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve comments';

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

// POST /api/comments - Tạo comment mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { postId, content, author, parentId, images } = body;
    if (!postId || !content || !author) {
      return NextResponse.json(
        {
          success: false,
          error: 'PostId, content, and author are required',
          data: null,
        },
        { status: 400 },
      );
    }

    const commentData = {
      postId: postId.trim(),
      content: content.trim(),
      author: author.trim(),
      parentId: parentId ? parentId.trim() : null,
      images: images || [],
    };

    const newComment = await CommentService.createComment(commentData);

    return NextResponse.json(
      {
        success: true,
        data: newComment,
        message: 'Comment created successfully',
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error('Error in POST /api/comments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create comment';

    // Handle specific errors
    if (errorMessage.includes('Invalid postId') || errorMessage.includes('Post not found')) {
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
