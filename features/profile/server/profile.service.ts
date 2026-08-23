import { ApiErrorCode, throwApiError } from '@/lib/api';
import { requireAdmin } from '@/lib/auth-guard';
import type { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { ProfileFormValues } from '../data';

const PROFILE_INCLUDE = {
  ogImage: true,
  heroImage: true,
} satisfies Prisma.ProfileInclude;

export const profileService = {
  async getMe(headers: Headers) {
    const { user } = await requireAdmin(headers);

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: PROFILE_INCLUDE,
    });

    if (!profile) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Profile not found.' });
    }

    return profile;
  },

  async upsert(headers: Headers, input: Partial<ProfileFormValues>) {
    const { user } = await requireAdmin(headers);

    const defaultName = input.name ?? user.name ?? 'Admin';

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        name: defaultName,
        ...input,
      },
      update: input,
      include: PROFILE_INCLUDE,
    });

    return profile;
  },
};
