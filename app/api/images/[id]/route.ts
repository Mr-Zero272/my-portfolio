import { type IImage } from '@/models';
import { ImageService } from '@/services/image-service';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/images/[id] - Lấy image theo ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const result = await ImageService.getImageById(id);

    if (result.status === 'error') {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    if (!result.data) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/images/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/images/[id] - Cập nhật image theo ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const body: Partial<IImage> = await request.json();

    // Remove fields that shouldn't be updated directly
    const updateData: Partial<IImage> = {};
    Object.keys(body).forEach((key) => {
      if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
        (updateData as Record<string, unknown>)[key] = (body as Record<string, unknown>)[key];
      }
    });

    const result = await ImageService.updateImage(id, updateData);

    if (result.status === 'error') {
      if (result.message === 'Image not found') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in PUT /api/images/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/images/[id] - Xóa image theo ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const result = await ImageService.deleteImage(id);

    if (result.status === 'error') {
      if (result.message === 'Image not found') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in DELETE /api/images/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
