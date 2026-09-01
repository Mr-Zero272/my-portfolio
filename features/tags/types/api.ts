import { BaseQuery, RequestConfig } from '@/types/api';
import { TagFormValues } from '../schemas';

export type GetTagsRequest = RequestConfig<undefined, BaseQuery, undefined>;

export type GetTagsWithMostPostsRequest = RequestConfig<undefined, BaseQuery, undefined>;

/** Shape returned by the public "tags with most posts" endpoint. */
export interface TagWithPostCount {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export type GetTagsBatchRequest = RequestConfig<undefined, { ids: string[], page?: number, limit?: number }, undefined>;

export type GetTagRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type CreateTagRequest = RequestConfig<undefined, undefined, TagFormValues>;

export type UpdateTagRequest = RequestConfig<{ id: string }, undefined, TagFormValues>;

export type DeleteTagRequest = RequestConfig<{ id: string }, undefined, undefined>;
