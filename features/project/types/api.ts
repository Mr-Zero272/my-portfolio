import { GalleryImage, Project } from '@/lib/generated/prisma/client';

/**
 * `Project.images` is a to-many relation through the `ProjectImage` join model.
 * The service maps the raw join rows to a plain `GalleryImage[]` for the client.
 */
export interface ProjectWithAllRelations extends Omit<Project, 'images'> {
  images: GalleryImage[];
}
