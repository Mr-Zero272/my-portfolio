import { buildBaseCrudService, type CrudListParams } from '@/lib/api';
import type { PostLike } from '@prisma/client';
import type { PostLikeCreateInput, PostLikeUpdateInput } from '../schemas';

export type PostLikeListParams = CrudListParams;

export const postLikeServices = buildBaseCrudService<
  PostLike,
  PostLikeCreateInput,
  PostLikeUpdateInput,
  PostLikeListParams
>({
  basePath: '/post-likes',
  dataKey: 'postLike',
});
