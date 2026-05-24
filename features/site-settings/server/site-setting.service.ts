import { ApiErrorCode, throwApiError } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { Prisma, SiteSetting, User } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import type {
  SiteSettingOnboardingInput,
  SiteSettingUpdateInput,
} from '../schemas/site-setting.schema';
import type { SafeSiteSetting } from '../types/site-setting.types';
import { encryptSecret, maskSecret } from './site-setting.crypto';

type SessionUser = Pick<User, 'id' | 'email'>;

const SAFE_SELECT = {
  id: true,
  mainUserId: true,
  siteName: true,
  siteDescription: true,
  siteUrl: true,
  siteLocale: true,
  siteKeywords: true,
  siteAuthor: true,
  sitePublisher: true,
  logo: true,
  favicon: true,
  defaultOgImage: true,
  ogType: true,
  ogImageAlt: true,
  metaTitle: true,
  metaDescription: true,
  twitterHandle: true,
  twitterCard: true,
  canonicalUrl: true,
  robotsIndex: true,
  robotsFollow: true,
  jsonLd: true,
  setupCompleted: true,
  theme: true,
  themeColor: true,
  githubUsername: true,
  githubAccessToken: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SiteSettingSelect;

function isAdminUser(user: SessionUser) {
  return Boolean(process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL);
}

function normalizeOptionalString(value: string | undefined) {
  return value?.trim() ? value.trim() : undefined;
}

function toSafeSiteSetting(setting: SiteSetting): SafeSiteSetting {
  const { githubAccessToken, ...safeSetting } = setting;

  return {
    ...safeSetting,
    hasGithubAccessToken: Boolean(githubAccessToken),
    githubAccessTokenMasked: maskSecret(githubAccessToken),
  };
}

function assignIfPresent<T extends object, K extends keyof SiteSettingUpdateInput>(
  target: T,
  input: SiteSettingUpdateInput,
  key: K,
) {
  if (Object.prototype.hasOwnProperty.call(input, key)) {
    Object.assign(target, { [key]: input[key] ?? null });
  }
}

async function getSessionUser(headers: Headers): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers });
  const user = session?.user;

  if (!user?.id || !user.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}

export async function requireSiteSettingUser(headers: Headers) {
  const user = await getSessionUser(headers);

  if (!user) {
    throwApiError(ApiErrorCode.UNAUTHORIZED);
  }

  const setting = await findAuthorizedSiteSetting(user);

  if (setting && (setting.mainUserId === user.id || isAdminUser(user))) {
    return { user, setting };
  }

  if (isAdminUser(user)) {
    return { user, setting: null };
  }

  throwApiError(ApiErrorCode.FORBIDDEN);
}

export async function findAuthorizedSiteSetting(user: SessionUser) {
  const ownSetting = await prisma.siteSetting.findUnique({
    where: { mainUserId: user.id },
    select: SAFE_SELECT,
  });

  if (ownSetting) {
    return ownSetting;
  }

  if (!isAdminUser(user)) {
    return null;
  }

  return prisma.siteSetting.findFirst({
    select: SAFE_SELECT,
    orderBy: { createdAt: 'asc' },
  });
}

export async function getSafeSiteSetting(headers: Headers) {
  const result = await requireSiteSettingUser(headers);

  return {
    setting: result.setting ? toSafeSiteSetting(result.setting) : null,
  };
}

export async function completeOnboarding(headers: Headers, input: SiteSettingOnboardingInput) {
  const user = await getSessionUser(headers);

  if (!user) {
    throwApiError(ApiErrorCode.UNAUTHORIZED);
  }

  if (!isAdminUser(user)) {
    const existingSetting = await prisma.siteSetting.findFirst({
      where: { OR: [{ mainUserId: user.id }, { setupCompleted: true }] },
      select: { mainUserId: true },
    });

    if (existingSetting && existingSetting.mainUserId !== user.id) {
      throwApiError(ApiErrorCode.FORBIDDEN);
    }
  }

  const data = {
    siteName: input.siteName,
    siteDescription: normalizeOptionalString(input.siteDescription),
    siteUrl: normalizeOptionalString(input.siteUrl),
    githubUsername: normalizeOptionalString(input.githubUsername),
    setupCompleted: true,
  };

  const setting = await prisma.siteSetting.upsert({
    where: { mainUserId: user.id },
    create: {
      ...data,
      mainUser: {
        connect: { id: user.id },
      },
    },
    update: data,
    select: SAFE_SELECT,
  });

  return {
    setting: toSafeSiteSetting(setting),
  };
}

export async function updateSiteSetting(headers: Headers, input: SiteSettingUpdateInput) {
  const result = await requireSiteSettingUser(headers);

  const { setting } = result;

  if (!setting) {
    throwApiError(ApiErrorCode.NOT_FOUND, {
      message: 'Site setting has not been created yet.',
    });
  }

  const data: Prisma.SiteSettingUpdateInput = {};

  assignIfPresent(data, input, 'siteName');
  assignIfPresent(data, input, 'siteDescription');
  assignIfPresent(data, input, 'siteUrl');
  assignIfPresent(data, input, 'siteLocale');
  assignIfPresent(data, input, 'siteKeywords');
  assignIfPresent(data, input, 'siteAuthor');
  assignIfPresent(data, input, 'sitePublisher');
  assignIfPresent(data, input, 'logo');
  assignIfPresent(data, input, 'favicon');
  assignIfPresent(data, input, 'defaultOgImage');
  assignIfPresent(data, input, 'ogType');
  assignIfPresent(data, input, 'ogImageAlt');
  assignIfPresent(data, input, 'metaTitle');
  assignIfPresent(data, input, 'metaDescription');
  assignIfPresent(data, input, 'twitterHandle');
  assignIfPresent(data, input, 'twitterCard');
  assignIfPresent(data, input, 'canonicalUrl');
  assignIfPresent(data, input, 'robotsIndex');
  assignIfPresent(data, input, 'robotsFollow');
  assignIfPresent(data, input, 'jsonLd');
  assignIfPresent(data, input, 'theme');
  assignIfPresent(data, input, 'themeColor');
  assignIfPresent(data, input, 'githubUsername');

  if (input.clearGithubAccessToken) {
    data.githubAccessToken = null;
  } else if (input.githubAccessToken) {
    data.githubAccessToken = encryptSecret(input.githubAccessToken);
  }

  const updatedSetting = await prisma.siteSetting.update({
    where: { id: setting.id },
    data,
    select: SAFE_SELECT,
  });

  return {
    setting: toSafeSiteSetting(updatedSetting),
  };
}
