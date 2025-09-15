import { TagService } from '@/services/tag-service';
// get request to get all tags
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const limit = params.get('limit') ? parseInt(params.get('limit') as string, 10) : 10;
  const page = params.get('page') ? parseInt(params.get('page') as string, 10) : 1;
  const tags = await TagService.getAllTags({ limit, page });
  return new Response(JSON.stringify(tags), { status: 200 });
}

// post request to create a new tag
export async function POST(req: Request) {
  const { name, slug } = await req.json();
  if (!name || !slug) {
    return new Response(JSON.stringify({ message: 'Name and slug are required' }), { status: 400 });
  }

  const newTag = await TagService.createTag({ name, slug });
  if (!newTag) {
    return new Response(JSON.stringify({ message: 'Failed to create tag' }), { status: 500 });
  }

  return new Response(JSON.stringify(newTag), { status: 201 });
}
