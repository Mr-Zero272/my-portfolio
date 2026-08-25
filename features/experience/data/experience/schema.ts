import { z } from 'zod';
import { ExperiencePositionIconTypeEnum } from '../../constants';

export const ExperiencePositionSchema = z.object({
  title: z.string().trim().min(1, "Position title can't be empty."),
  employmentType: z.string().trim().nullable().optional(),
  location: z.string().trim().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  icon: z.enum(ExperiencePositionIconTypeEnum).nullable().optional(),
  skills: z.array(z.string()),
});

export const ExperienceFormSchema = z.object({
  companyName: z.string().trim().min(1, "Company name can't be empty."),
  companyLogoId: z.string().trim().nullable().optional(),
  companyWebsite: z.string().trim().nullable().optional(),
  isCurrentEmployer: z.boolean(),
  positions: z.array(ExperiencePositionSchema),
  displayOrder: z.number(),
  isVisible: z.boolean(),
});

export type ExperiencePositionValues = z.infer<typeof ExperiencePositionSchema>;
export type ExperienceFormValues = z.infer<typeof ExperienceFormSchema>;

export const DEFAULT_EXPERIENCE_FORM_VALUES: ExperienceFormValues = {
  companyName: '',
  companyLogoId: null,
  companyWebsite: null,
  isCurrentEmployer: false,
  positions: [],
  displayOrder: 0,
  isVisible: true,
};
