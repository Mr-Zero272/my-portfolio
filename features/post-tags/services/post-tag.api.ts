import { buildBaseCrudService, type CrudListParams } from '@/lib/api';
import type { PostTag } from '@prisma/client';
import type { PostTagCreateInput, PostTagUpdateInput } from '../schemas';

export type PostTagListParams = CrudListParams;

export const postTagServices = buildBaseCrudService<
  PostTag,
  PostTagCreateInput,
  PostTagUpdateInput,
  PostTagListParams
>({
  basePath: '/post-tags',
  dataKey: 'postTag',
});
