import { z } from 'zod';

export const EducationFormSchema = z.object({
  institution: z.string().trim().min(1, "Institution name can't be empty."),
  degree: z.string().trim().min(1, "Degree can't be empty."),
  fieldOfStudy: z.string().trim().nullable().optional(),
  startDate: z.coerce.date({ message: 'Start date is required.' }),
  endDate: z.coerce.date().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  location: z.string().trim().nullable().optional(),
  displayOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export type EducationFormValues = z.infer<typeof EducationFormSchema>;
