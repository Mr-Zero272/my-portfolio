import { CommentService } from '@/services/comment-service';
import { PostService } from '@/services/post-service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/posts/[slug]/comments - Lấy tất cả comments của post theo slug
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post slug is required',
          data: null,
        },
        { status: 400 },
      );
    }

    // Kiểm tra post có tồn tại không
    const post = await PostService.getPostBySlug(slug);
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
          data: null,
        },
        { status: 404 },
      );
    }

    let comments;
    if (search) {
      // Tìm kiếm comments trong post này
      comments = await CommentService.searchComments(search, post.id.toString());
    } else {
      // Lấy tất cả comments của post
      comments = await CommentService.getCommentsByPostId(post.id.toString());
    }

    // Lấy số lượng comments
    const commentCount = await CommentService.getCommentCount(post.id.toString());

    return NextResponse.json({
      success: true,
      data: {
        comments,
        total: commentCount,
        post: {
          id: post._id,
          title: post.title,
          slug: post.slug,
        },
      },
      message: 'Comments retrieved successfully',
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/posts/[slug]/comments:', error);
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

// POST /api/posts/[slug]/comments - Tạo comment mới cho post theo slug
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post slug is required',
          data: null,
        },
        { status: 400 },
      );
    }

    // Validate required fields
    const { content, author } = body;
    if (!content || !author) {
      return NextResponse.json(
        {
          success: false,
          error: 'Content and author are required',
          data: null,
        },
        { status: 400 },
      );
    }

    // Kiểm tra post có tồn tại không
    const post = await PostService.getPostBySlug(slug);
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
          data: null,
        },
        { status: 404 },
      );
    }

    const commentData = {
      postId: post.id.toString(),
      content: content.trim(),
      author: author.trim(),
    };

    const newComment = await CommentService.createComment(commentData);

    return NextResponse.json(
      {
        success: true,
        data: {
          comment: newComment,
          post: {
            id: post._id,
            title: post.title,
            slug: post.slug,
          },
        },
        message: 'Comment created successfully',
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error('Error in POST /api/posts/[slug]/comments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create comment';

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
