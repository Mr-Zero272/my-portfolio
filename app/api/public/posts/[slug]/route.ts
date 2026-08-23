import { getPublicPost } from '@/features/posts/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type PublicPostRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export const GET = withApiErrorHandling(
  async (request: Request, context: PublicPostRouteContext) => {
    const { slug } = await context.params;
    const result = await getPublicPost(slug);

    return apiOk(result);
  },
);
