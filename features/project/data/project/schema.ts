import { z } from 'zod';
import { ProjectStatusEnum, ProjectTypeEnum } from '../../constants';

export const ProjectFormSchema = z.object({
  name: z.string().trim().min(1, "Project name can't be empty."),
  slug: z.string().trim().optional(),
  description: z.string().trim().min(1, "Description can't be empty."),
  responsibilities: z.string().trim().nullable().optional(),
  type: z.enum(ProjectTypeEnum),
  status: z.enum(ProjectStatusEnum),
  images: z.array(z.string()),
  demoUrl: z.string().trim().nullable().optional(),
  sourceCodeUrl: z.string().trim().nullable().optional(),
  technologies: z.array(z.string()),
  databases: z.array(z.string()),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  isFeatured: z.boolean(),
  displayOrder: z.number(),
  isVisible: z.boolean(),
  metaTitle: z.string().trim().nullable().optional(),
  metaDescription: z.string().trim().nullable().optional(),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

export const DEFAULT_PROJECT_FORM_VALUES: ProjectFormValues = {
  name: '',
  slug: '',
  description: '',
  responsibilities: null,
  type: ProjectTypeEnum.WEBSITE,
  status: ProjectStatusEnum.DEVELOPING,
  images: [],
  demoUrl: null,
  sourceCodeUrl: null,
  technologies: [],
  databases: [],
  startDate: null,
  endDate: null,
  isFeatured: false,
  displayOrder: 0,
  isVisible: true,
  metaTitle: null,
  metaDescription: null,
};
