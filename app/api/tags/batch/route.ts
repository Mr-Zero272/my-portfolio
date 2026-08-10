import { tagService } from "@/features/tags";
import { apiPaginated, withApiErrorHandling } from "@/lib/api";

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await tagService.getBatch(request.headers, searchParams);

  return apiPaginated(result.tags, {
    limit: result.tags.length,
    page: 1,
    total: result.tags.length,
  });
})