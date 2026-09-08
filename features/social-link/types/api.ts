import { BaseQuery, RequestConfig } from '@/types/api';
import { SocialLink } from '@prisma/client';
import { BulkSortSocialLinksInput, SocialLinkFormValues } from '../data';

export type GetSocialLinksRequest = RequestConfig<{ id: string }, BaseQuery, undefined>;

export type GetSocialLinkRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type CreateSocialLinkRequest = RequestConfig<undefined, undefined, SocialLinkFormValues>;

export type UpdateSocialLinkRequest = RequestConfig<{ id: string }, undefined, Partial<SocialLinkFormValues>>;

export type DeleteSocialLinkRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type BulkSortSocialLinksRequest = RequestConfig<undefined, undefined, BulkSortSocialLinksInput>;
