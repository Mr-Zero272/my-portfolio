import { GalleryImage, Project } from '@/lib/generated/prisma/client';
import { BaseQuery, RequestConfig } from '@/types/api';
import { ProjectFormValues } from '../data';

/** Owner user as serialized by the service (admin includes email; public omits it). */
export interface ProjectOwner {
  id: string;
  name: string;
  email?: string | null;
  image?: string | null;
}

/**
 * `Project.images` is a to-many relation through the `ProjectImage` join model.
 * The service maps the raw join rows to a plain `GalleryImage[]` for the client.
 */
export interface ProjectWithAllRelations extends Omit<Project, 'images' | 'user'> {
  images: GalleryImage[];
  user?: ProjectOwner;
}

export type GetProjectsRequest = RequestConfig<undefined, BaseQuery, undefined>;

export type GetProjectRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type CreateProjectRequest = RequestConfig<undefined, undefined, ProjectFormValues>;

export type UpdateProjectRequest = RequestConfig<
  { id: string },
  undefined,
  Partial<ProjectFormValues>
>;

export type DeleteProjectRequest = RequestConfig<{ id: string }, undefined, undefined>;
