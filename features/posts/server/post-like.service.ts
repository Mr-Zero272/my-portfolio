import { ApiErrorCode, buildListQuery, throwApiError } from '@/lib/api';
import type { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import type { PostLikeCreateInput, PostLikeUpdateInput } from '../schemas/post-like.schema';
import { requirePostManager } from './post-auth';

const POST_LIKE_INCLUDE = {
  post: {
    select: {
      id: true,
      slug: true,
      title: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
} satisfies Prisma.PostLikeInclude;

const POST_LIKE_SORTABLE_FIELDS = ['createdAt', 'postId', 'userId'] as const;

export async function getPostLikes(headers: Headers, searchParams: URLSearchParams) {
  await requirePostManager(headers);

  const query = buildListQuery<Prisma.PostLikeWhereInput>(searchParams, {
    filterFields: {
      postId: {},
      userId: {},
    },
    searchFields: ['postId', 'userId'],
    sortableFields: POST_LIKE_SORTABLE_FIELDS,
  });

  const [postLikes, total] = await Promise.all([
    prisma.postLike.findMany({
      include: POST_LIKE_INCLUDE,
      orderBy: query.orderBy,
      skip: query.pagination.skip,
      take: query.pagination.take,
      where: query.where,
    }),
    prisma.postLike.count({ where: query.where }),
  ]);

  return {
    pagination: query.pagination,
    postLikes,
    total,
  };
}

export async function getPostLike(headers: Headers, id: string) {
  await requirePostManager(headers);

  const postLike = await prisma.postLike.findUnique({
    include: POST_LIKE_INCLUDE,
    where: { id },
  });

  if (!postLike) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Post like not found.' });
  }

  return { postLike };
}

export async function createPostLike(headers: Headers, input: PostLikeCreateInput) {
  await requirePostManager(headers);

  const postLike = await prisma.postLike.create({
    data: input,
    include: POST_LIKE_INCLUDE,
  });

  return { postLike };
}

export async function updatePostLike(headers: Headers, id: string, input: PostLikeUpdateInput) {
  await requirePostManager(headers);

  await ensurePostLikeExists(id);

  const postLike = await prisma.postLike.update({
    data: input,
    include: POST_LIKE_INCLUDE,
    where: { id },
  });

  return { postLike };
}

export async function deletePostLike(headers: Headers, id: string) {
  await requirePostManager(headers);

  await ensurePostLikeExists(id);
  await prisma.postLike.delete({ where: { id } });

  return { id };
}

async function ensurePostLikeExists(id: string) {
  const postLike = await prisma.postLike.findUnique({
    select: { id: true },
    where: { id },
  });

  if (!postLike) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Post like not found.' });
  }
}
