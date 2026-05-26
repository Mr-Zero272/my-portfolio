import { requireSiteSettingUser } from '@/features/site-settings/server/site-setting.service';
import { ApiErrorCode, buildListQuery, throwApiError } from '@/lib/api';
import type { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import type { PostTagCreateInput, PostTagUpdateInput } from '../schemas/post-tag.schema';

const POST_TAG_INCLUDE = {
  post: {
    select: {
      id: true,
      slug: true,
      title: true,
    },
  },
  tag: true,
} satisfies Prisma.PostTagInclude;

const POST_TAG_SORTABLE_FIELDS = ['createdAt', 'postId', 'tagId'] as const;

export async function getPostTags(headers: Headers, searchParams: URLSearchParams) {
  await requireSiteSettingUser(headers);

  const query = buildListQuery<Prisma.PostTagWhereInput>(searchParams, {
    filterFields: {
      postId: {},
      tagId: {},
    },
    searchFields: ['postId', 'tagId'],
    sortableFields: POST_TAG_SORTABLE_FIELDS,
  });

  const [postTags, total] = await Promise.all([
    prisma.postTag.findMany({
      include: POST_TAG_INCLUDE,
      orderBy: query.orderBy,
      skip: query.pagination.skip,
      take: query.pagination.take,
      where: query.where,
    }),
    prisma.postTag.count({ where: query.where }),
  ]);

  return {
    pagination: query.pagination,
    postTags,
    total,
  };
}

export async function getPostTag(headers: Headers, id: string) {
  await requireSiteSettingUser(headers);

  const postTag = await prisma.postTag.findUnique({
    include: POST_TAG_INCLUDE,
    where: { id },
  });

  if (!postTag) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Post tag not found.' });
  }

  return { postTag };
}

export async function createPostTag(headers: Headers, input: PostTagCreateInput) {
  await requireSiteSettingUser(headers);

  const postTag = await prisma.postTag.create({
    data: input,
    include: POST_TAG_INCLUDE,
  });

  return { postTag };
}

export async function updatePostTag(headers: Headers, id: string, input: PostTagUpdateInput) {
  await requireSiteSettingUser(headers);

  await ensurePostTagExists(id);

  const postTag = await prisma.postTag.update({
    data: input,
    include: POST_TAG_INCLUDE,
    where: { id },
  });

  return { postTag };
}

export async function deletePostTag(headers: Headers, id: string) {
  await requireSiteSettingUser(headers);

  await ensurePostTagExists(id);
  await prisma.postTag.delete({ where: { id } });

  return { id };
}

async function ensurePostTagExists(id: string) {
  const postTag = await prisma.postTag.findUnique({
    select: { id: true },
    where: { id },
  });

  if (!postTag) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Post tag not found.' });
  }
}
