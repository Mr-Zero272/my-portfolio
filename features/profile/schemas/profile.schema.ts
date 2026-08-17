import { z } from 'zod';

export const ProfileFormSchema = z.object({
  name: z.string().trim().min(1, "Name can't be empty."),
  phone: z.string().trim().nullable().optional(),
  nationality: z.string().trim().nullable().optional(),
  address: z.string().trim().nullable().optional(),
  yoe: z.number().int().min(0).nullable().optional(),
  resumePath: z.string().trim().nullable().optional(),
  tagline: z.string().trim().nullable().optional(),
  bio: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  freelanceAvailable: z.boolean().default(true),
  languages: z.array(z.string()).default(['Vietnamese', 'English']),
  rotatingWords: z.array(z.string()).default(['Web', 'Software', 'Mainframe']),
  heroVideo: z.string().trim().nullable().optional(),
  metaTitle: z.string().trim().nullable().optional(),
  metaDescription: z.string().trim().nullable().optional(),
  ogImage: z.string().trim().nullable().optional(),
  isActive: z.boolean().default(true),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
