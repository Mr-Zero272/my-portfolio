import { getPostSlugs } from "@/features/posts/server";
import { apiPaginated, withApiErrorHandling } from "@/lib/api";

export const GET = withApiErrorHandling(async (request: Request) => {
  const result = await getPostSlugs();

  return apiPaginated(result, {
    limit: result.length,
    page: 1,
    total: result.length,
  });
});