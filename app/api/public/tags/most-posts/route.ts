import { tagService } from '@/features/tags/server';
import { apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await tagService.getTagsWithMostPosts(searchParams);

  return apiPaginated(result.tags, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});
