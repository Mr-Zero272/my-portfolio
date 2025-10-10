import { type IPost } from '@/models';
import { PostService } from '@/services/post-service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/posts - Lấy danh sách tất cả posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let result;

    if (search) {
      // Tìm kiếm posts theo title hoặc content
      result = await PostService.searchPosts(search, {
        published: status === 'published' ? true : status === 'drafts' ? false : undefined,
        tag: tag || undefined,
        page,
        limit,
      });
    } else {
      result = await PostService.getAllPosts({
        published: status === 'published' ? true : status === 'drafts' ? false : undefined,
        tag: tag || undefined,
        page,
        limit,
      });
    }

    if (result.status === 'error') {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          data: null,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ...result,
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve posts';
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

// POST /api/posts - Tạo post mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { title, slug, content } = body;
    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title, slug, and content are required',
          data: null,
        },
        { status: 400 },
      );
    }

    // Extract optional fields
    const postData: Partial<IPost> = {
      title: title.trim(),
      slug: slug.trim(),
      content,
      excerpt: body.excerpt || '',
      featureImage: body.featureImage,
      imageCaption: body.imageCaption || '',
      tags: body.tags || [],
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      xMetaTitle: body.xMetaTitle,
      xMetaDescription: body.xMetaDescription,
      xMetaImage: body.xMetaImage,
      published: body.published || false,
    };

    const result = await PostService.createPost(postData);

    if (result.status === 'error') {
      // Handle specific errors
      if (result.message && result.message.includes('already exists')) {
        return NextResponse.json(
          {
            success: false,
            error: result.message,
            data: null,
          },
          { status: 409 }, // Conflict
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: result.message,
          data: null,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: 'Post created successfully',
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error('Error in POST /api/posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create post';

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
