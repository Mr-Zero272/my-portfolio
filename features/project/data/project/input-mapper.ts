import {
    parseToProjectStatus,
    parseToProjectType,
    ProjectStatusEnum,
    ProjectTypeEnum,
} from '../../constants';
import { ProjectWithAllRelations } from '../../types';
import { ProjectFormValues } from './schema';

export const toProjectFormValues = (project: ProjectWithAllRelations): ProjectFormValues => ({
  name: project.name,
  slug: project.slug,
  description: project.description,
  responsibilities: project.responsibilities,
  type: parseToProjectType(project.type, ProjectTypeEnum.WEBSITE),
  status: parseToProjectStatus(project.status, ProjectStatusEnum.DEVELOPING),
  images: project.images.map((image) => image.id),
  demoUrl: project.demoUrl,
  sourceCodeUrl: project.sourceCodeUrl,
  technologies: project.technologies,
  databases: project.databases,
  startDate: project.startDate ? new Date(project.startDate).toISOString() : null,
  endDate: project.endDate ? new Date(project.endDate).toISOString() : null,
  isFeatured: project.isFeatured,
  displayOrder: project.displayOrder,
  isVisible: project.isVisible,
  metaTitle: project.metaTitle,
  metaDescription: project.metaDescription,
});
