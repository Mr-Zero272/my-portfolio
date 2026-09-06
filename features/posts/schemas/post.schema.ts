import { PostStatus } from '@prisma/client';
import { z } from 'zod';

const optionalString = z.string().optional();

const stringList = z.array(z.string().trim().min(1)).optional();

export const PostFormSchema = z.object({
  title: z.string().trim().min(1, 'Post title is required.'),
  slug: z.string().trim().min(1, 'Post slug is required.'),
  excerpt: optionalString,
  content: z.string().trim().min(1, 'Post content is required.'),
  contentHtml: optionalString,
  keywords: stringList,
  featureImageId: optionalString,
  imageCaption: optionalString,
  likes: z.number().int().min(0).optional(),
  views: z.number().int().min(0).optional(),
  shares: z.number().int().min(0).optional(),
  metaTitle: optionalString,
  metaDescription: optionalString,
  xMetaTitle: optionalString,
  xMetaDescription: optionalString,
  xMetaImage: optionalString,
  status: z.enum(PostStatus).optional(),
  authorIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

export type PostFormValues = z.infer<typeof PostFormSchema>;

export const DEFAULT_POST_FORM_VALUES: PostFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  contentHtml: '',
  keywords: [],
  featureImageId: '',
  imageCaption: '',
  likes: 0,
  views: 0,
  shares: 0,
  metaTitle: '',
  metaDescription: '',
  xMetaTitle: '',
  xMetaDescription: '',
  xMetaImage: '',
  status: 'Draft',
};
