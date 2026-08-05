import { BaseQuery, RequestConfig } from '@/types/api';
import { TagFormValues } from '../schemas';

export type GetTagsRequest = RequestConfig<undefined, BaseQuery, undefined>;

export type GetTagRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type CreateTagRequest = RequestConfig<undefined, undefined, TagFormValues>;

export type UpdateTagRequest = RequestConfig<{ id: string }, undefined, TagFormValues>;

export type DeleteTagRequest = RequestConfig<{ id: string }, undefined, undefined>;
