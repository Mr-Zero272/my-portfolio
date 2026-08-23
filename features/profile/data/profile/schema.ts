import { z } from 'zod';

export const ProfileFormSchema = z.object({
  name: z.string().trim().min(1, "Name can't be empty."),
  phone: z.string().trim().nullable().optional(),
  nationality: z.string().trim().nullable().optional(),
  address: z.string().trim().nullable().optional(),
  yoe: z.number().min(0).nullable().optional(),
  resumePath: z.string().trim().nullable().optional(),
  tagline: z.string().trim().nullable().optional(),
  bio: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  freelanceAvailable: z.boolean(),
  languages: z.array(z.string()),
  rotatingWords: z.array(z.string()),
  metaTitle: z.string().trim().nullable().optional(),
  metaDescription: z.string().trim().nullable().optional(),
  ogImageId: z.string().trim().nullable().optional(),
  heroImageId: z.string().trim().nullable().optional(),
  cvUrl: z.string().trim().nullable().optional(),
  isActive: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
