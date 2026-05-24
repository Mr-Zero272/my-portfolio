import { z } from 'zod';

const optionalTrimmedString = z
  .union([z.string().trim().min(1), z.literal('')])
  .optional()
  .transform((value) => (value ? value : undefined));

const optionalUrl = z
  .union([z.url(), z.literal('')])
  .optional()
  .transform((value) => (value ? value : undefined));

const optionalJson = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  if (value.trim() === '') return undefined;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}, z.unknown().optional());

export const siteSettingOnboardingSchema = z.object({
  siteName: z.string().trim().min(2, 'Site name must be at least 2 characters'),
  siteDescription: optionalTrimmedString,
  siteUrl: optionalUrl,
  githubUsername: optionalTrimmedString,
});

export const siteSettingUpdateSchema = siteSettingOnboardingSchema
  .extend({
    siteLocale: optionalTrimmedString,
    siteKeywords: z.array(z.string().trim().min(1)).optional(),
    siteAuthor: optionalTrimmedString,
    sitePublisher: optionalTrimmedString,
    logo: optionalTrimmedString,
    favicon: optionalTrimmedString,
    defaultOgImage: optionalTrimmedString,
    ogType: optionalTrimmedString,
    ogImageAlt: optionalTrimmedString,
    metaTitle: optionalTrimmedString,
    metaDescription: optionalTrimmedString,
    twitterHandle: optionalTrimmedString,
    twitterCard: optionalTrimmedString,
    canonicalUrl: optionalUrl,
    robotsIndex: z.boolean().optional(),
    robotsFollow: z.boolean().optional(),
    jsonLd: optionalJson,
    theme: optionalTrimmedString,
    themeColor: optionalTrimmedString,
    githubAccessToken: optionalTrimmedString,
    clearGithubAccessToken: z.boolean().optional(),
  })
  .partial({
    siteName: true,
  });

export type SiteSettingOnboardingInput = z.infer<typeof siteSettingOnboardingSchema>;
export type SiteSettingOnboardingFormInput = z.input<typeof siteSettingOnboardingSchema>;
export type SiteSettingUpdateInput = z.infer<typeof siteSettingUpdateSchema>;
