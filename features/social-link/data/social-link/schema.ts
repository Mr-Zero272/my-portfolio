import { z } from 'zod';
import { SOCIAL_LINK_PLATFORM_VALUES } from '../../constants';

export const SocialLinkFormSchema = z.object({
  platform: z.enum(SOCIAL_LINK_PLATFORM_VALUES),
  url: z.string().trim().min(1, "URL can't be empty."),
  username: z.string().trim().nullable().optional(),
  isActive: z.boolean(),
  displayOrder: z.number(),
});

export type SocialLinkFormValues = z.infer<typeof SocialLinkFormSchema>;

export const DEFAULT_SOCIAL_LINK_FORM_VALUES: SocialLinkFormValues = {
  platform: 'github',
  url: '',
  username: null,
  isActive: true,
  displayOrder: 0,
};

export const BulkSortItemSchema = z.object({
  id: z.string(),
  displayOrder: z.number().int(),
});

export const BulkSortSocialLinksSchema = z.object({
  items: z.array(BulkSortItemSchema),
});

export type BulkSortSocialLinksInput = z.infer<typeof BulkSortSocialLinksSchema>;

