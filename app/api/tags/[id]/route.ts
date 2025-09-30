import { TagService } from '@/services/tag-service';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const tag = await TagService.getTagById(id);

  if (!tag) {
    return new Response(JSON.stringify({ message: 'Tag not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(tag), { status: 200 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const updated = await TagService.updateTag({ id, name: data.name, slug: data.slug });

  return new Response(JSON.stringify(updated), { status: updated.status === 'success' ? 200 : 400 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const deleted = await TagService.deleteTag(id);

  return new Response(JSON.stringify({ deleted }), { status: deleted ? 200 : 404 });
}
