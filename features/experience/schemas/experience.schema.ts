import { z } from 'zod';

export const ExperiencePositionIconTypeEnum = z.enum(['code', 'design', 'business', 'education']);

export const ExperiencePositionSchema = z.object({
  title: z.string().trim().min(1, "Position title can't be empty."),
  employmentType: z.string().trim().nullable().optional(),
  location: z.string().trim().nullable().optional(),
  startDate: z.coerce.date({ message: 'Start date is required.' }),
  endDate: z.coerce.date().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  icon: ExperiencePositionIconTypeEnum.default('business'),
  skills: z.array(z.string()).default([]),
});

export const ExperienceFormSchema = z.object({
  companyName: z.string().trim().min(1, "Company name can't be empty."),
  companyLogo: z.string().trim().nullable().optional(),
  isCurrentEmployer: z.boolean().default(false),
  positions: z.array(ExperiencePositionSchema).default([]),
  displayOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export type ExperiencePositionValues = z.infer<typeof ExperiencePositionSchema>;
export type ExperienceFormValues = z.infer<typeof ExperienceFormSchema>;
