import { postLikeCreateSchema } from '@/features/posts/schemas';
import { createPostLike, getPostLikes } from '@/features/posts/server';
import { apiCreated, apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await getPostLikes(request.headers, searchParams);

  return apiPaginated(result.postLikes, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = postLikeCreateSchema.parse(body);
  const result = await createPostLike(request.headers, input);

  return apiCreated(result);
});
