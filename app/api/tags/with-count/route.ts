import { TagService } from '@/services/tag-service';

// GET request to get all tags with post count
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const limit = params.get('limit') ? parseInt(params.get('limit') as string, 10) : 10;
  const page = params.get('page') ? parseInt(params.get('page') as string, 10) : 1;
  const publishedOnly = params.get('publishedOnly') !== 'false'; // Default to true

  const tags = await TagService.getTagsWithPostCount({ limit, page, publishedOnly });
  return new Response(JSON.stringify(tags), { status: 200 });
}
