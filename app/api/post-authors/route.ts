import { postAuthorCreateSchema } from '@/features/post-authors/schemas';
import { createPostAuthor, getPostAuthors } from '@/features/post-authors/server';
import { apiCreated, apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await getPostAuthors(request.headers, searchParams);

  return apiPaginated(result.postAuthors, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = postAuthorCreateSchema.parse(body);
  const result = await createPostAuthor(request.headers, input);

  return apiCreated(result);
});
