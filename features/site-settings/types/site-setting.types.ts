import type { Prisma, SiteSetting } from '@/lib/generated/prisma/client';

export type SafeSiteSetting = Omit<SiteSetting, 'githubAccessToken' | 'jsonLd'> & {
  jsonLd: Prisma.JsonValue | null;
  hasGithubAccessToken: boolean;
  githubAccessTokenMasked: string | null;
};
