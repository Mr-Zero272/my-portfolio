import { IPost } from '@/models/Post';
import { PostService } from '@/services/post-service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/posts/[slug] - Lấy post theo slug
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug is required',
          data: null,
        },
        { status: 400 },
      );
    }

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

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Post retrieved successfully',
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/posts/[slug]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve post';

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

// PUT /api/posts/[slug] - Cập nhật post
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug is required',
          data: null,
        },
        { status: 400 },
      );
    }

    // Extract updateable fields
    const updateData: Partial<IPost> = {};
    const allowedFields = [
      'title',
      'slug',
      'content',
      'featureImage',
      'tags',
      'metaTitle',
      'metaDescription',
      'xMetaTitle',
      'xMetaDescription',
      'xMetaImage',
      'published',
    ];

    // Only update provided fields
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        (updateData as Record<string, unknown>)[field] = body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid fields provided for update',
          data: null,
        },
        { status: 400 },
      );
    }

    const updatedPost = await PostService.updatePost(slug, updateData);

    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: 'Post updated successfully',
    });
  } catch (error: unknown) {
    console.error('Error in PUT /api/posts/[slug]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update post';

    // Handle specific errors
    if (errorMessage.includes('already exists')) {
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          data: null,
        },
        { status: 409 }, // Conflict
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

// DELETE /api/posts/[slug] - Xóa post
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug is required',
          data: null,
        },
        { status: 400 },
      );
    }

    const deleted = await PostService.deletePost(slug);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Post deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Error in DELETE /api/posts/[slug]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';

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
