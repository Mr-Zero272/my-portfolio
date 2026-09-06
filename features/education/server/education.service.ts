import { getMainUserId } from '@/features/site-settings/server/main-user';
import { ApiErrorCode, buildListQuery, parseBooleanParam, throwApiError } from '@/lib/api';
import { requireAdmin } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { EducationFormValues } from '../data';

const EDUCATION_SORTABLE_FIELDS = ['displayOrder', 'startDate', 'endDate', 'institution', 'createdAt'] as const;
const EDUCATION_SEARCH_FIELDS = ['institution', 'degree', 'fieldOfStudy', 'location'] as const;

export const educationService = {
  async getAll(headers: Headers, searchParams: URLSearchParams) {
    const { user } = await requireAdmin(headers);

    const query = buildListQuery<Prisma.EducationWhereInput>(searchParams, {
      baseWhere: { userId: user.id },
      defaultSort: { displayOrder: 'asc' },
      filterFields: {
        isVisible: { parse: parseBooleanParam },
      },
      searchFields: EDUCATION_SEARCH_FIELDS,
      sortableFields: EDUCATION_SORTABLE_FIELDS,
    });

    const [educations, total] = await Promise.all([
      prisma.education.findMany({
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where: query.where,
      }),
      prisma.education.count({ where: query.where }),
    ]);

    return {
      educations,
      pagination: query.pagination,
      total,
    };
  },

  async getPublicAll(searchParams: URLSearchParams) {
    const mainUserId = await getMainUserId();

    const query = buildListQuery<Prisma.EducationWhereInput>(searchParams, {
      baseWhere: { isVisible: true },
      defaultSort: { displayOrder: 'asc' },
      searchFields: EDUCATION_SEARCH_FIELDS,
      sortableFields: EDUCATION_SORTABLE_FIELDS,
    });

    if (!mainUserId) {
      return {
        educations: [],
        pagination: query.pagination,
        total: 0,
      };
    }

    const where: Prisma.EducationWhereInput = {
      ...query.where,
      userId: mainUserId,
    };

    const [educations, total] = await Promise.all([
      prisma.education.findMany({
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where,
      }),
      prisma.education.count({ where }),
    ]);

    return {
      educations,
      pagination: query.pagination,
      total,
    };
  },

  async getById(headers: Headers, id: string) {
    const { user } = await requireAdmin(headers);

    const education = await prisma.education.findFirst({
      where: { id, userId: user.id },
    });

    if (!education) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Education record not found.' });
    }

    return education;
  },

  async create(headers: Headers, input: EducationFormValues) {
    const { user } = await requireAdmin(headers);

    const education = await prisma.education.create({
      data: {
        ...input,
        userId: user.id,
      },
    });

    return education;
  },

  async update(headers: Headers, id: string, input: Partial<EducationFormValues>) {
    const { user } = await requireAdmin(headers);

    await ensureEducationExists(id, user.id);

    const education = await prisma.education.update({
      data: input,
      where: { id },
    });

    return education;
  },

  async delete(headers: Headers, id: string) {
    const { user } = await requireAdmin(headers);

    await ensureEducationExists(id, user.id);
    await prisma.education.delete({ where: { id } });

    return { id };
  },
};

async function ensureEducationExists(id: string, userId: string) {
  const education = await prisma.education.findFirst({
    select: { id: true },
    where: { id, userId },
  });

  if (!education) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Education record not found.' });
  }
}
