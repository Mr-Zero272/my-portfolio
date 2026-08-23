import { getPublicPosts } from '@/features/posts/server';
import { apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await getPublicPosts(searchParams);

  return apiPaginated(result.posts, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});
