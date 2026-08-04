import { ApiErrorCode, buildListQuery, throwApiError } from '@/lib/api';
import { requireAdmin } from '@/lib/auth-guard';
import type { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import type { PostAuthorCreateInput, PostAuthorUpdateInput } from '../schemas/post-author.schema';

const POST_AUTHOR_INCLUDE = {
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
} satisfies Prisma.PostAuthorInclude;

const POST_AUTHOR_SORTABLE_FIELDS = ['createdAt', 'postId', 'userId'] as const;

export async function getPostAuthors(headers: Headers, searchParams: URLSearchParams) {
  await requireAdmin(headers);

  const query = buildListQuery<Prisma.PostAuthorWhereInput>(searchParams, {
    filterFields: {
      postId: {},
      userId: {},
    },
    searchFields: ['postId', 'userId'],
    sortableFields: POST_AUTHOR_SORTABLE_FIELDS,
  });

  const [postAuthors, total] = await Promise.all([
    prisma.postAuthor.findMany({
      include: POST_AUTHOR_INCLUDE,
      orderBy: query.orderBy,
      skip: query.pagination.skip,
      take: query.pagination.take,
      where: query.where,
    }),
    prisma.postAuthor.count({ where: query.where }),
  ]);

  return {
    pagination: query.pagination,
    postAuthors,
    total,
  };
}

export async function getPostAuthor(headers: Headers, id: string) {
  await requireAdmin(headers);

  const postAuthor = await prisma.postAuthor.findUnique({
    include: POST_AUTHOR_INCLUDE,
    where: { id },
  });

  if (!postAuthor) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Post author not found.' });
  }

  return { postAuthor };
}

export async function createPostAuthor(headers: Headers, input: PostAuthorCreateInput) {
  await requireAdmin(headers);

  const postAuthor = await prisma.postAuthor.create({
    data: input,
    include: POST_AUTHOR_INCLUDE,
  });

  return { postAuthor };
}

export async function updatePostAuthor(headers: Headers, id: string, input: PostAuthorUpdateInput) {
  await requireAdmin(headers);

  await ensurePostAuthorExists(id);

  const postAuthor = await prisma.postAuthor.update({
    data: input,
    include: POST_AUTHOR_INCLUDE,
    where: { id },
  });

  return { postAuthor };
}

export async function deletePostAuthor(headers: Headers, id: string) {
  await requireAdmin(headers);

  await ensurePostAuthorExists(id);
  await prisma.postAuthor.delete({ where: { id } });

  return { id };
}

async function ensurePostAuthorExists(id: string) {
  const postAuthor = await prisma.postAuthor.findUnique({
    select: { id: true },
    where: { id },
  });

  if (!postAuthor) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Post author not found.' });
  }
}
