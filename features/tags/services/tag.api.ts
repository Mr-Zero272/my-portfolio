import { buildBaseCrudService, type CrudListParams } from '@/lib/api';
import type { Tag } from '@/lib/generated/prisma/browser';
import type { TagCreateInput, TagUpdateInput } from '../schemas';

export type TagListParams = CrudListParams;

export const tagServices = buildBaseCrudService<Tag, TagCreateInput, TagUpdateInput, TagListParams>(
  {
    basePath: '/tags',
    dataKey: 'tag',
  },
);
