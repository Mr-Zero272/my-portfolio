import { ApiErrorCode, buildListQuery, throwApiError } from '@/lib/api';
import { requireAdmin } from '@/lib/auth-guard';
import type { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { TagFormValues } from '../schemas';

const TAG_INCLUDE = {
  _count: {
    select: {
      posts: true,
    },
  },
} satisfies Prisma.TagInclude;

const TAG_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'name', 'slug'] as const;
const TAG_SEARCH_FIELDS = ['name', 'slug'] as const;

export const tagService = {
  async getAll(headers: Headers, searchParams: URLSearchParams) {
    await requireAdmin(headers);

    const query = buildListQuery<Prisma.TagWhereInput>(searchParams, {
      searchFields: TAG_SEARCH_FIELDS,
      sortableFields: TAG_SORTABLE_FIELDS,
    });

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        include: TAG_INCLUDE,
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where: query.where,
      }),
      prisma.tag.count({ where: query.where }),
    ]);

    return {
      pagination: query.pagination,
      tags,
      total,
    };
  },

  async getBatch(headers: Headers, searchParams: URLSearchParams) {
    requireAdmin(headers);

    const ids = searchParams.getAll('ids');
    const tags = await  prisma.tag.findMany({
        include: TAG_INCLUDE,
        where: { id: { in: ids } },
      })

    return {
      tags,
    }
  },

  async getById(headers: Headers, id: string) {
    await requireAdmin(headers);

    const tag = await prisma.tag.findUnique({
      include: TAG_INCLUDE,
      where: { id },
    });

    if (!tag) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Tag not found.' });
    }

    return tag;
  },

  async create(headers: Headers, input: TagFormValues) {
    await requireAdmin(headers);

    const tag = await prisma.tag.create({
      data: input,
      include: TAG_INCLUDE,
    });

    return tag;
  },

  async update(headers: Headers, id: string, input: TagFormValues) {
    await requireAdmin(headers);

    await ensureTagExists(id);

    const tag = await prisma.tag.update({
      data: input,
      include: TAG_INCLUDE,
      where: { id },
    });

    return tag;
  },

  async delete(headers: Headers, id: string) {
    await requireAdmin(headers);

    await ensureTagExists(id);
    await prisma.tag.delete({ where: { id } });

    return { id };
  },
};

async function ensureTagExists(id: string) {
  const tag = await prisma.tag.findUnique({
    select: { id: true },
    where: { id },
  });

  if (!tag) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Tag not found.' });
  }
}
