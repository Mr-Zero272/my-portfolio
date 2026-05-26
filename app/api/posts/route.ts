import { postCreateSchema } from '@/features/posts/schemas';
import { createPost, getPosts } from '@/features/posts/server';
import { apiCreated, apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await getPosts(request.headers, searchParams);

  return apiPaginated(result.posts, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = postCreateSchema.parse(body);
  const result = await createPost(request.headers, input);

  return apiCreated(result);
});
