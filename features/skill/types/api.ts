import { GalleryImage, Skill } from '@/lib/generated/prisma/client';

export interface SkillWithAllRelations extends Skill {
  icon?: GalleryImage | null;
}
