import { tagCreateSchema } from '@/features/tags/schemas';
import { createTag, getTags } from '@/features/tags/server';
import { apiCreated, apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await getTags(request.headers, searchParams);

  return apiPaginated(result.tags, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = tagCreateSchema.parse(body);
  const result = await createTag(request.headers, input);

  return apiCreated(result);
});
