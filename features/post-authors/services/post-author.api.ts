import { buildBaseCrudService, type CrudListParams } from '@/lib/api';
import type { PostAuthor } from '@/lib/generated/prisma/browser';
import type { PostAuthorCreateInput, PostAuthorUpdateInput } from '../schemas';

export type PostAuthorListParams = CrudListParams;

export const postAuthorServices = buildBaseCrudService<
  PostAuthor,
  PostAuthorCreateInput,
  PostAuthorUpdateInput,
  PostAuthorListParams
>({
  basePath: '/post-authors',
  dataKey: 'postAuthor',
});
