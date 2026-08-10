import {
  GalleryImage,
  Post,
  PostAuthor,
  PostStatus,
  PostTag,
  Tag,
  User,
} from '@/lib/generated/prisma/client';
import { BaseQuery, RequestConfig } from '@/types/api';
import { PostFormValues } from '../schemas';

export interface PostWithAllRelations extends Post {
  featureImage?: GalleryImage;
  tags?: (PostTag & { tag: Tag })[];
  authors?: (PostAuthor & { author: User })[];
}

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

export type GenerateKeywordsRequest = RequestConfig<
  undefined,
  undefined,
  { content: string; title: string }
>;

export type GenerateExcerptRequest = RequestConfig<
  undefined,
  undefined,
  { content: string; title: string }
>;

export type CreatePostRequest = RequestConfig<undefined, undefined, PostFormValues>;

export type UpdatePostRequest = RequestConfig<{ id: string }, undefined, PostFormValues>;

export type DeletePostRequest = RequestConfig<{ id: string }, undefined, undefined>;
