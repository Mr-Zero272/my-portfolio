import { z } from 'zod';

export const postTagCreateSchema = z.object({
  postId: z.string().trim().min(1),
  tagId: z.string().trim().min(1),
});

export const postTagUpdateSchema = postTagCreateSchema.partial();

export type PostTagCreateInput = z.infer<typeof postTagCreateSchema>;
export type PostTagUpdateInput = z.infer<typeof postTagUpdateSchema>;
