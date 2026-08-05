import { TagFormSchema } from '@/features/tags';
import { tagService } from '@/features/tags/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type TagRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(async (request: Request, context: TagRouteContext) => {
  const { id } = await context.params;
  const result = await tagService.getById(request.headers, id);

  return apiOk(result);
});

export const PATCH = withApiErrorHandling(async (request: Request, context: TagRouteContext) => {
  const { id } = await context.params;
  const body = await request.json();
  const input = TagFormSchema.parse(body);
  const result = await tagService.update(request.headers, id, input);

  return apiOk(result);
});

export const DELETE = withApiErrorHandling(async (request: Request, context: TagRouteContext) => {
  const { id } = await context.params;
  const result = await tagService.delete(request.headers, id);

  return apiOk(result);
});
