import { postTagUpdateSchema } from '@/features/posts/schemas';
import { deletePostTag, getPostTag, updatePostTag } from '@/features/posts/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type PostTagRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(async (request: Request, context: PostTagRouteContext) => {
  const { id } = await context.params;
  const result = await getPostTag(request.headers, id);

  return apiOk(result);
});

export const PATCH = withApiErrorHandling(
  async (request: Request, context: PostTagRouteContext) => {
    const { id } = await context.params;
    const body = await request.json();
    const input = postTagUpdateSchema.parse(body);
    const result = await updatePostTag(request.headers, id, input);

    return apiOk(result);
  },
);

export const DELETE = withApiErrorHandling(
  async (request: Request, context: PostTagRouteContext) => {
    const { id } = await context.params;
    const result = await deletePostTag(request.headers, id);

    return apiOk(result);
  },
);
