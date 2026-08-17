import { ApiErrorCode, buildListQuery, parseBooleanParam, throwApiError } from '@/lib/api';
import { requireAdmin } from '@/lib/auth-guard';
import type { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { ExperienceFormValues } from '../schemas';

const EXPERIENCE_SORTABLE_FIELDS = ['displayOrder', 'companyName', 'createdAt'] as const;
const EXPERIENCE_SEARCH_FIELDS = ['companyName'] as const;

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
      }),
      prisma.experience.count({ where: query.where }),
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
    });

    return experience;
  },

  async update(headers: Headers, id: string, input: Partial<ExperienceFormValues>) {
    const { user } = await requireAdmin(headers);

    await ensureExperienceExists(id, user.id);

    const experience = await prisma.experience.update({
      data: input,
      where: { id },
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
