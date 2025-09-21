import { TagService } from '@/services/tag-service';

// GET request to get tags statistics
export async function GET() {
  const stats = await TagService.getTagsStats();
  return new Response(JSON.stringify(stats), { status: 200 });
}
