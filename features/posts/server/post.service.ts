import {
  ApiErrorCode,
  FilterOperator,
  buildListQuery,
  parseBooleanParam,
  parseNumberParam,
  throwApiError,
} from '@/lib/api';
import type { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import type { PostFormValues } from '../schemas/post.schema';
import { requirePostManager } from './post-auth';

const POST_INCLUDE = {
  authors: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
  likedBy: true,
} satisfies Prisma.PostInclude;

const POST_SORTABLE_FIELDS = [
  'createdAt',
  'updatedAt',
  'title',
  'slug',
  'likes',
  'views',
  'shares',
] as const;

function buildPostData(input: PostFormValues) {
  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    contentHtml: input.contentHtml,
    keywords: input.keywords,
    featureImage: input.featureImage,
    imageCaption: input.imageCaption,
    likes: input.likes,
    views: input.views,
    shares: input.shares,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    xMetaTitle: input.xMetaTitle,
    xMetaDescription: input.xMetaDescription,
    xMetaImage: input.xMetaImage,
    published: input.published,
  };
}

export async function getPosts(headers: Headers, searchParams: URLSearchParams) {
  await requirePostManager(headers);

  const query = buildListQuery<Prisma.PostWhereInput>(searchParams, {
    filterFields: {
      published: { parse: parseBooleanParam },
      likes: { operator: FilterOperator.GTE, parse: parseNumberParam },
      views: { operator: FilterOperator.GTE, parse: parseNumberParam },
      keyword: { field: 'keywords', operator: FilterOperator.HAS },
      authorId: { field: 'authors.userId', operator: FilterOperator.EQUALS },
      tagId: { field: 'tags.tagId', operator: FilterOperator.EQUALS },
    },
    searchFields: ['title', 'slug', 'excerpt', 'content'],
    sortableFields: POST_SORTABLE_FIELDS,
  });

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      include: POST_INCLUDE,
      orderBy: query.orderBy,
      skip: query.pagination.skip,
      take: query.pagination.take,
      where: query.where,
    }),
    prisma.post.count({ where: query.where }),
  ]);

  return {
    pagination: query.pagination,
    posts,
    total,
  };
}

export async function getPost(headers: Headers, id: string) {
  await requirePostManager(headers);

  const post = await prisma.post.findUnique({
    include: POST_INCLUDE,
    where: { id },
  });

  if (!post) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Post not found.' });
  }

  return post;
}

export async function createPost(headers: Headers, input: PostFormValues) {
  await requirePostManager(headers);

  const post = await prisma.post.create({
    data: buildPostData(input) as Prisma.PostCreateInput,
    include: POST_INCLUDE,
  });

  return post;
}

export async function updatePost(headers: Headers, id: string, input: PostFormValues) {
  await requirePostManager(headers);

  await ensurePostExists(id);

  const post = await prisma.post.update({
    data: buildPostData(input) as Prisma.PostUpdateInput,
    include: POST_INCLUDE,
    where: { id },
  });

  return post;
}

export async function deletePost(headers: Headers, id: string) {
  await requirePostManager(headers);

  await ensurePostExists(id);
  await prisma.post.delete({ where: { id } });

  return { id };
}

async function ensurePostExists(id: string) {
  const post = await prisma.post.findUnique({
    select: { id: true },
    where: { id },
  });

  if (!post) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Post not found.' });
  }
}
