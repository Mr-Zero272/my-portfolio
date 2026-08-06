import { PostFormSchema } from '@/features/posts';
import { deletePost, getPost, updatePost } from '@/features/posts/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type PostRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(async (request: Request, context: PostRouteContext) => {
  const { id } = await context.params;
  const result = await getPost(request.headers, id);

  return apiOk(result);
});

export const PATCH = withApiErrorHandling(async (request: Request, context: PostRouteContext) => {
  const { id } = await context.params;
  const body = await request.json();
  const input = PostFormSchema.parse(body);
  const result = await updatePost(request.headers, id, input);

  return apiOk(result);
});

export const DELETE = withApiErrorHandling(async (request: Request, context: PostRouteContext) => {
  const { id } = await context.params;
  const result = await deletePost(request.headers, id);

  return apiOk(result);
});
