import { getPublicPostLikeCount } from '@/features/post-likes/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type PublicPostLikeRouteContext = {
  params: Promise<{
    postId: string;
  }>;
};

export const GET = withApiErrorHandling(
  async (request: Request, context: PublicPostLikeRouteContext) => {
    const { postId } = await context.params;
    const result = await getPublicPostLikeCount(postId);

    return apiOk(result);
  },
);
