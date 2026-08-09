import { PostStatus } from '@/lib/generated/prisma/enums';
import { BaseQuery, RequestConfig } from '@/types/api';
import { PostFormValues } from '../schemas';

export type GetPostsRequest = RequestConfig<
  undefined,
  BaseQuery<{
    likes?: number;
    views?: number;
    keyword?: string;
    tagId?: string;
    authorId?: string;
    status?: PostStatus;
  }>,
  undefined
>;

export type GetPostRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type CreatePostRequest = RequestConfig<undefined, undefined, PostFormValues>;

export type UpdatePostRequest = RequestConfig<{ id: string }, undefined, PostFormValues>;

export type DeletePostRequest = RequestConfig<{ id: string }, undefined, undefined>;
