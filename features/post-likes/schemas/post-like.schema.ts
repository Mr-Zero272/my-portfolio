import { z } from 'zod';

export const postLikeCreateSchema = z.object({
  postId: z.string().trim().min(1),
  userId: z.string().trim().min(1),
});

export const postLikeUpdateSchema = postLikeCreateSchema.partial();

export type PostLikeCreateInput = z.infer<typeof postLikeCreateSchema>;
export type PostLikeUpdateInput = z.infer<typeof postLikeUpdateSchema>;
