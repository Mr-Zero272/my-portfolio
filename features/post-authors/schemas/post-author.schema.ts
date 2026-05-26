import { z } from 'zod';

export const postAuthorCreateSchema = z.object({
  postId: z.string().trim().min(1),
  userId: z.string().trim().min(1),
});

export const postAuthorUpdateSchema = postAuthorCreateSchema.partial();

export type PostAuthorCreateInput = z.infer<typeof postAuthorCreateSchema>;
export type PostAuthorUpdateInput = z.infer<typeof postAuthorUpdateSchema>;
