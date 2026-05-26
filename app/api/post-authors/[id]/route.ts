import { postAuthorUpdateSchema } from '@/features/post-authors/schemas';
import { deletePostAuthor, getPostAuthor, updatePostAuthor } from '@/features/post-authors/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type PostAuthorRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(
  async (request: Request, context: PostAuthorRouteContext) => {
    const { id } = await context.params;
    const result = await getPostAuthor(request.headers, id);

    return apiOk(result);
  },
);

export const PATCH = withApiErrorHandling(
  async (request: Request, context: PostAuthorRouteContext) => {
    const { id } = await context.params;
    const body = await request.json();
    const input = postAuthorUpdateSchema.parse(body);
    const result = await updatePostAuthor(request.headers, id, input);

    return apiOk(result);
  },
);

export const DELETE = withApiErrorHandling(
  async (request: Request, context: PostAuthorRouteContext) => {
    const { id } = await context.params;
    const result = await deletePostAuthor(request.headers, id);

    return apiOk(result);
  },
);
