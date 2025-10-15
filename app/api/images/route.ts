import { type IImage } from '@/models';
import { ImageService } from '@/services/image-service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/images - Lấy danh sách tất cả images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userCreated = searchParams.get('userCreated');
    const search = searchParams.get('search');

    let result;

    if (search) {
      // Tìm kiếm images theo name hoặc caption
      result = await ImageService.searchImages(search, {
        userCreated: userCreated || undefined,
        page,
        limit,
      });
    } else {
      result = await ImageService.getAllImages({
        userCreated: userCreated || undefined,
        page,
        limit,
      });
    }

    if (result.status === 'error') {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/images - Tạo image mới
export async function POST(request: NextRequest) {
  try {
    const body: Partial<IImage> = await request.json();

    // Validate required fields
    if (!body.url || !body.name || !body.size || !body.mineType || !body.userCreated) {
      return NextResponse.json(
        { error: 'Missing required fields: url, name, size, mineType, userCreated' },
        { status: 400 },
      );
    }

    const result = await ImageService.createImage(body);

    if (result.status === 'error') {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
