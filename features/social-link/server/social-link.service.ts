import { getMainUserId } from '@/features/site-settings/server/main-user';
import { ApiErrorCode, buildListQuery, parseBooleanParam, throwApiError } from '@/lib/api';
import { requireAdmin } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { type Prisma } from '@prisma/client';
import { SocialLinkFormValues } from '../data';

const SOCIAL_LINK_SORTABLE_FIELDS = ['displayOrder', 'createdAt', 'platform'] as const;
const SOCIAL_LINK_SEARCH_FIELDS = ['platform', 'url', 'username'] as const;

export const socialLinkService = {
  async getAll(headers: Headers, searchParams: URLSearchParams) {
    const { user } = await requireAdmin(headers);

    const query = buildListQuery<Prisma.SocialLinkWhereInput>(searchParams, {
      baseWhere: { userId: user.id },
      defaultSort: { displayOrder: 'asc' },
      filterFields: {
        isActive: { parse: parseBooleanParam },
      },
      searchFields: SOCIAL_LINK_SEARCH_FIELDS,
      sortableFields: SOCIAL_LINK_SORTABLE_FIELDS,
    });

    const [socialLinks, total] = await Promise.all([
      prisma.socialLink.findMany({
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where: query.where,
      }),
      prisma.socialLink.count({ where: query.where }),
    ]);

    return {
      socialLinks,
      pagination: query.pagination,
      total,
    };
  },

  async getPublicAll(searchParams: URLSearchParams) {
    const mainUserId = await getMainUserId();

    const query = buildListQuery<Prisma.SocialLinkWhereInput>(searchParams, {
      baseWhere: { isActive: true },
      defaultSort: { displayOrder: 'asc' },
      searchFields: SOCIAL_LINK_SEARCH_FIELDS,
      sortableFields: SOCIAL_LINK_SORTABLE_FIELDS,
    });

    if (!mainUserId) {
      return {
        socialLinks: [],
        pagination: query.pagination,
        total: 0,
      };
    }

    const where: Prisma.SocialLinkWhereInput = {
      ...query.where,
      userId: mainUserId,
    };

    const [socialLinks, total] = await Promise.all([
      prisma.socialLink.findMany({
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where,
      }),
      prisma.socialLink.count({ where }),
    ]);

    return {
      socialLinks,
      pagination: query.pagination,
      total,
    };
  },

  async getById(headers: Headers, id: string) {
    const { user } = await requireAdmin(headers);

    const socialLink = await prisma.socialLink.findFirst({
      where: { id, userId: user.id },
    });

    if (!socialLink) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Social link record not found.' });
    }

    return socialLink;
  },

  async create(headers: Headers, input: SocialLinkFormValues) {
    const { user } = await requireAdmin(headers);

    const socialLink = await prisma.socialLink.create({
      data: {
        platform: input.platform,
        url: input.url,
        username: input.username ?? undefined,
        isActive: input.isActive,
        displayOrder: input.displayOrder,
        userId: user.id,
      },
    });

    return socialLink;
  },

  async update(headers: Headers, id: string, input: Partial<SocialLinkFormValues>) {
    const { user } = await requireAdmin(headers);

    await ensureSocialLinkExists(id, user.id);

    const data: Prisma.SocialLinkUpdateInput = {};

    if (input.platform !== undefined) data.platform = input.platform;
    if (input.url !== undefined) data.url = input.url;
    if (input.username !== undefined) data.username = input.username ?? null;
    if (input.isActive !== undefined) data.isActive = input.isActive;
    if (input.displayOrder !== undefined) data.displayOrder = input.displayOrder;

    const socialLink = await prisma.socialLink.update({
      data,
      where: { id },
    });

    return socialLink;
  },

  async delete(headers: Headers, id: string) {
    const { user } = await requireAdmin(headers);

    await ensureSocialLinkExists(id, user.id);
    await prisma.socialLink.delete({ where: { id } });

    return { id };
  },

  async bulkSort(headers: Headers, items: Array<{ id: string; displayOrder: number }>) {
    const { user } = await requireAdmin(headers);

    await prisma.$transaction(
      items.map((item) =>
        prisma.socialLink.updateMany({
          where: { id: item.id, userId: user.id },
          data: { displayOrder: item.displayOrder },
        }),
      ),
    );

    return { success: true };
  },
};

async function ensureSocialLinkExists(id: string, userId: string) {
  const socialLink = await prisma.socialLink.findFirst({
    select: { id: true },
    where: { id, userId },
  });

  if (!socialLink) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Social link record not found.' });
  }
}
