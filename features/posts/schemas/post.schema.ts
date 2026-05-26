import { z } from 'zod';

const optionalString = z
  .union([z.string().trim().min(1), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value ? value : null));

const stringList = z.array(z.string().trim().min(1)).optional();

export const postCreateSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  excerpt: optionalString,
  content: z.string().trim().min(1),
  contentHtml: optionalString,
  keywords: stringList,
  featureImage: optionalString,
  imageCaption: optionalString,
  likes: z.number().int().min(0).optional(),
  views: z.number().int().min(0).optional(),
  shares: z.number().int().min(0).optional(),
  metaTitle: optionalString,
  metaDescription: optionalString,
  xMetaTitle: optionalString,
  xMetaDescription: optionalString,
  xMetaImage: optionalString,
  published: z.boolean().optional(),
});

export const postUpdateSchema = postCreateSchema.partial();

export type PostCreateInput = z.infer<typeof postCreateSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
