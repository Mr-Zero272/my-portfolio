import { BulkSortSocialLinksSchema } from '@/features/social-link/data';
import { socialLinkService } from '@/features/social-link/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

export const PUT = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = BulkSortSocialLinksSchema.parse(body);
  const result = await socialLinkService.bulkSort(request.headers, input.items);

  return apiOk(result);
});
