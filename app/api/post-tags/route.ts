import { postTagCreateSchema } from '@/features/post-tags/schemas';
import { createPostTag, getPostTags } from '@/features/post-tags/server';
import { apiCreated, apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await getPostTags(request.headers, searchParams);

  return apiPaginated(result.postTags, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = postTagCreateSchema.parse(body);
  const result = await createPostTag(request.headers, input);

  return apiCreated(result);
});
