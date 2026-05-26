import { postLikeUpdateSchema } from '@/features/post-likes/schemas';
import { deletePostLike, getPostLike, updatePostLike } from '@/features/post-likes/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type PostLikeRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(async (request: Request, context: PostLikeRouteContext) => {
  const { id } = await context.params;
  const result = await getPostLike(request.headers, id);

  return apiOk(result);
});

export const PATCH = withApiErrorHandling(
  async (request: Request, context: PostLikeRouteContext) => {
    const { id } = await context.params;
    const body = await request.json();
    const input = postLikeUpdateSchema.parse(body);
    const result = await updatePostLike(request.headers, id, input);

    return apiOk(result);
  },
);

export const DELETE = withApiErrorHandling(
  async (request: Request, context: PostLikeRouteContext) => {
    const { id } = await context.params;
    const result = await deletePostLike(request.headers, id);

    return apiOk(result);
  },
);
