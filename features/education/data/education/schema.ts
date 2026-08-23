import { z } from 'zod';

export const EducationFormSchema = z.object({
  institution: z.string().trim().min(1, "Institution name can't be empty."),
  degree: z.string().trim().min(1, "Degree can't be empty."),
  fieldOfStudy: z.string().trim().nullable().optional(),
  startDate: z.string().trim(),
  endDate: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  location: z.string().trim().nullable().optional(),
  gpa: z.number().optional(),
  gpaScale: z.number().optional(),
  displayOrder: z.number(),
  isVisible: z.boolean(),
});

export type EducationFormValues = z.infer<typeof EducationFormSchema>;

export const DEFAULT_EDUCATION_FORM_VALUES: EducationFormValues = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  description: '',
  location: '',
  gpa: 0,
  gpaScale: 4,
  displayOrder: 0,
  isVisible: true,
};
