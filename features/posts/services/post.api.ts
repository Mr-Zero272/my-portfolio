import { buildBaseCrudService, type CrudListParams } from '@/lib/api';
import type { Post } from '@/lib/generated/prisma/browser';
import type { PostCreateInput, PostUpdateInput } from '../schemas';

export type PostListParams = CrudListParams;

export const postServices = buildBaseCrudService<
  Post,
  PostCreateInput,
  PostUpdateInput,
  PostListParams
>({
  basePath: '/posts',
  dataKey: 'post',
});
