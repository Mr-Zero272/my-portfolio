import { ImageService } from '@/services/image-service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/images/search - Tìm kiếm images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userCreated = searchParams.get('userCreated');

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const result = await ImageService.searchImages(query, {
      userCreated: userCreated || undefined,
      page,
      limit,
    });

    if (result.status === 'error') {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/images/search:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
