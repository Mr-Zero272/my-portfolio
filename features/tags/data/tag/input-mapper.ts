import { Tag } from '@/lib/generated/prisma/client';
import { TagFormValues } from '../../schemas';

export const toTagFormValue = (tag: Tag): TagFormValues => {
  return {
    name: tag.name,
    slug: tag.slug,
  };
};
