import { requireSiteSettingUser } from '@/features/site-settings/server/site-setting.service';
import { ApiErrorCode, buildListQuery, throwApiError } from '@/lib/api';
import type { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import type { TagCreateInput, TagUpdateInput } from '../schemas/tag.schema';

const TAG_INCLUDE = {
  _count: {
    select: {
      posts: true,
    },
  },
} satisfies Prisma.TagInclude;

const TAG_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'name', 'slug'] as const;

export async function getTags(headers: Headers, searchParams: URLSearchParams) {
  await requireSiteSettingUser(headers);

  const query = buildListQuery<Prisma.TagWhereInput>(searchParams, {
    searchFields: ['name', 'slug'],
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
}

export async function getTag(headers: Headers, id: string) {
  await requireSiteSettingUser(headers);

  const tag = await prisma.tag.findUnique({
    include: TAG_INCLUDE,
    where: { id },
  });

  if (!tag) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Tag not found.' });
  }

  return { tag };
}

export async function createTag(headers: Headers, input: TagCreateInput) {
  await requireSiteSettingUser(headers);

  const tag = await prisma.tag.create({
    data: input,
    include: TAG_INCLUDE,
  });

  return { tag };
}

export async function updateTag(headers: Headers, id: string, input: TagUpdateInput) {
  await requireSiteSettingUser(headers);

  await ensureTagExists(id);

  const tag = await prisma.tag.update({
    data: input,
    include: TAG_INCLUDE,
    where: { id },
  });

  return { tag };
}

export async function deleteTag(headers: Headers, id: string) {
  await requireSiteSettingUser(headers);

  await ensureTagExists(id);
  await prisma.tag.delete({ where: { id } });

  return { id };
}

async function ensureTagExists(id: string) {
  const tag = await prisma.tag.findUnique({
    select: { id: true },
    where: { id },
  });

  if (!tag) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Tag not found.' });
  }
}
