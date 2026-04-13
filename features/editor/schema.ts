import { z } from 'zod';

export const postSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim().min(1, 'Title is required'),
  slug: z.string().trim().min(1, 'Post URL is required'),
  excerpt: z.string().optional().default(''),
  content: z.string().min(1, 'Content is required'),
  contentHtml: z.string().min(1, 'HTML Content is required'),
  keywords: z.array(z.string()).default([]),
  featureImage: z.string().optional().default(''),
  featureImageFile: z.any().nullable().optional(), // For local file selection
  imageCaption: z.string().optional().default(''),
  likes: z.number().default(0).optional(),
  authors: z.array(z.string()).min(1, 'At least one author is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  comments: z.array(z.string()).default([]),
  metaTitle: z.string().optional().default(''),
  metaDescription: z.string().optional().default(''),
  xMetaTitle: z.string().optional().default(''),
  xMetaDescription: z.string().optional().default(''),
  xMetaImage: z.string().optional().default(''),
  xMetaImageFile: z.any().nullable().optional(),
  published: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type PostSchema = z.infer<typeof postSchema>;

export const initialPostValues: PostSchema = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  contentHtml: '',
  keywords: [],
  featureImage: '',
  featureImageFile: null,
  imageCaption: '',
  likes: 0,
  authors: [],
  tags: [],
  comments: [],
  metaTitle: '',
  metaDescription: '',
  xMetaTitle: '',
  xMetaDescription: '',
  xMetaImage: '',
  xMetaImageFile: null,
  published: false,
};
