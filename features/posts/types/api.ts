import { BaseQuery, RequestConfig } from '@/types/api';
import { PostFormValues } from '../schemas';

export type GetPostsRequest = RequestConfig<
  undefined,
  BaseQuery<{
    published?: boolean;
    likes?: number;
    views?: number;
    keyword?: string;
    tagId?: string;
    authorId?: string;
  }>,
  undefined
>;

export type GetPostRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type CreatePostRequest = RequestConfig<undefined, undefined, PostFormValues>;

export type UpdatePostRequest = RequestConfig<{ id: string }, undefined, PostFormValues>;

export type DeletePostRequest = RequestConfig<{ id: string }, undefined, undefined>;
