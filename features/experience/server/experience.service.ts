import { getMainUserId } from '@/features/site-settings/server/main-user';
import { ApiErrorCode, buildListQuery, parseBooleanParam, throwApiError } from '@/lib/api';
import { requireAdmin } from '@/lib/auth-guard';
import type { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { ExperienceFormValues } from '../schemas';

const EXPERIENCE_SORTABLE_FIELDS = ['displayOrder', 'companyName', 'createdAt'] as const;
const EXPERIENCE_SEARCH_FIELDS = ['companyName'] as const;

const EXPERIENCE_INCLUDE = {
  companyLogo: true,
} satisfies Prisma.ExperienceInclude;

export const experienceService = {
  async getAll(headers: Headers, searchParams: URLSearchParams) {
    const { user } = await requireAdmin(headers);

    const query = buildListQuery<Prisma.ExperienceWhereInput>(searchParams, {
      baseWhere: { userId: user.id },
      defaultSort: { displayOrder: 'asc' },
      filterFields: {
        isCurrentEmployer: { parse: parseBooleanParam },
        isVisible: { parse: parseBooleanParam },
      },
      searchFields: EXPERIENCE_SEARCH_FIELDS,
      sortableFields: EXPERIENCE_SORTABLE_FIELDS,
    });

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where: query.where,
        include: EXPERIENCE_INCLUDE,
      }),
      prisma.experience.count({ where: query.where }),
    ]);

    return {
      experiences,
      pagination: query.pagination,
      total,
    };
  },

  async getPublicAll(searchParams: URLSearchParams) {
    const mainUserId = await getMainUserId();

    const query = buildListQuery<Prisma.ExperienceWhereInput>(searchParams, {
      baseWhere: { isVisible: true },
      defaultSort: { displayOrder: 'asc' },
      filterFields: {
        isCurrentEmployer: { parse: parseBooleanParam },
      },
      searchFields: EXPERIENCE_SEARCH_FIELDS,
      sortableFields: EXPERIENCE_SORTABLE_FIELDS,
    });

    if (!mainUserId) {
      return {
        experiences: [],
        pagination: query.pagination,
        total: 0,
      };
    }

    const where: Prisma.ExperienceWhereInput = {
      ...query.where,
      userId: mainUserId,
    };

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        include: EXPERIENCE_INCLUDE,
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where,
      }),
      prisma.experience.count({ where }),
    ]);

    return {
      experiences,
      pagination: query.pagination,
      total,
    };
  },

  async getById(headers: Headers, id: string) {
    const { user } = await requireAdmin(headers);

    const experience = await prisma.experience.findFirst({
      where: { id, userId: user.id },
      include: EXPERIENCE_INCLUDE,
    });

    if (!experience) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Experience record not found.' });
    }

    return experience;
  },

  async create(headers: Headers, input: ExperienceFormValues) {
    const { user } = await requireAdmin(headers);

    const experience = await prisma.experience.create({
      data: {
        ...input,
        userId: user.id,
      },
      include: EXPERIENCE_INCLUDE,
    });

    return experience;
  },

  async update(headers: Headers, id: string, input: Partial<ExperienceFormValues>) {
    const { user } = await requireAdmin(headers);

    await ensureExperienceExists(id, user.id);

    const experience = await prisma.experience.update({
      data: input,
      where: { id },
      include: EXPERIENCE_INCLUDE,
    });

    return experience;
  },

  async delete(headers: Headers, id: string) {
    const { user } = await requireAdmin(headers);

    await ensureExperienceExists(id, user.id);
    await prisma.experience.delete({ where: { id } });

    return { id };
  },
};

async function ensureExperienceExists(id: string, userId: string) {
  const experience = await prisma.experience.findFirst({
    select: { id: true },
    where: { id, userId },
  });

  if (!experience) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Experience record not found.' });
  }
}
