import { tagUpdateSchema } from '@/features/posts/schemas';
import { deleteTag, getTag, updateTag } from '@/features/posts/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type TagRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(async (request: Request, context: TagRouteContext) => {
  const { id } = await context.params;
  const result = await getTag(request.headers, id);

  return apiOk(result);
});

export const PATCH = withApiErrorHandling(async (request: Request, context: TagRouteContext) => {
  const { id } = await context.params;
  const body = await request.json();
  const input = tagUpdateSchema.parse(body);
  const result = await updateTag(request.headers, id, input);

  return apiOk(result);
});

export const DELETE = withApiErrorHandling(async (request: Request, context: TagRouteContext) => {
  const { id } = await context.params;
  const result = await deleteTag(request.headers, id);

  return apiOk(result);
});
