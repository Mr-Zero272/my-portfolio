import { BulkSortSkillsSchema } from '@/features/skill/data';
import { skillService } from '@/features/skill/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

export const PUT = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = BulkSortSkillsSchema.parse(body);
  const result = await skillService.bulkSort(request.headers, input.items);

  return apiOk(result);
});
