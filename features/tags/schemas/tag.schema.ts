import { z } from 'zod';

export const TagFormSchema = z.object({
  name: z.string().trim().min(1, "Tag name can't be empty."),
  slug: z.string().trim().min(1, "Tag slug can't be empty."),
});

export type TagFormValues = z.infer<typeof TagFormSchema>;

export const DEFAULT_TAG_FORM_VALUES: TagFormValues = {
  name: '',
  slug: '',
};
