import { getMainUserId } from '@/features/site-settings/server/main-user';
import {
  ApiErrorCode,
  FilterOperator,
  buildListQuery,
  parseBooleanParam,
  parseEnumParam,
  parseNumberParam,
  throwApiError,
} from '@/lib/api';
import type { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { isCuid } from '@/utils/id';
import type { PostFormValues } from '../schemas/post.schema';
import { requirePostManager } from './post-auth';

const POST_INCLUDE = {
  featureImage: true,
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

const PUBLIC_POST_INCLUDE = {
  featureImage: true,
  authors: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
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
    featureImageId: input.featureImageId,
    imageCaption: input.imageCaption,
    likes: input.likes,
    views: input.views,
    shares: input.shares,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    xMetaTitle: input.xMetaTitle,
    xMetaDescription: input.xMetaDescription,
    xMetaImage: input.xMetaImage,
    status: input.status,
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
      status: {
        operator: FilterOperator.EQUALS,
        parse: parseEnumParam(['Draft', 'Published']),
      },
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

export async function getPublicPosts(searchParams: URLSearchParams) {
  const mainUserId = await getMainUserId();

  const query = buildListQuery<Prisma.PostWhereInput>(searchParams, {
    baseWhere: { status: 'Published' },
    defaultSort: { createdAt: 'desc' },
    filterFields: {
      keyword: { field: 'keywords', operator: FilterOperator.HAS },
      tagId: { field: 'tags.tagId', operator: FilterOperator.EQUALS },
    },
    searchFields: ['title', 'slug', 'excerpt'],
    sortableFields: POST_SORTABLE_FIELDS,
  });

  if (!mainUserId) {
    return {
      pagination: query.pagination,
      posts: [],
      total: 0,
    };
  }

  const where: Prisma.PostWhereInput = {
    ...query.where,
    authors: { some: { userId: mainUserId } },
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      include: PUBLIC_POST_INCLUDE,
      orderBy: query.orderBy,
      skip: query.pagination.skip,
      take: query.pagination.take,
      where,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    pagination: query.pagination,
    posts,
    total,
  };
}

export async function getPostSlugs() {
  return prisma.post.findMany({
    select: {
      slug: true,
    },
  });
}

export async function getPost(headers: Headers, id: string) {
  await requirePostManager(headers);
  const isId = isCuid(id);

  const where = isId ? { id } : { slug: id };

  const post = await prisma.post.findUnique({
    include: POST_INCLUDE,
    where,
  });

  if (!post) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Post not found.' });
  }

  return post;
}

export async function getPublicPost(slug: string) {
  const mainUserId = await getMainUserId();

  const where: Prisma.PostWhereInput = mainUserId
    ? { slug, status: 'Published', authors: { some: { userId: mainUserId } } }
    : { slug: '__none__' };

  const post = await prisma.post.findFirst({
    include: PUBLIC_POST_INCLUDE,
    where,
  });

  if (!post) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Post not found.' });
  }

  return post;
}

export async function createPost(headers: Headers, input: PostFormValues) {
  const { user } = await requirePostManager(headers);

  const authorIds = input.authorIds && input.authorIds.length > 0 ? input.authorIds : [user.id];

  const tagIds = input.tagIds && input.tagIds.length > 0 ? input.tagIds : [];

  const postData: Prisma.PostCreateInput = {
    ...buildPostData(input),
    authors: {
      create: authorIds.map((userId) => ({ userId })),
    },
    tags: {
      create: tagIds.map((tagId) => ({ tagId })),
    },
  };

  const post = await prisma.post.create({
    data: postData,
    include: POST_INCLUDE,
  });

  return post;
}

export async function updatePost(headers: Headers, id: string, input: PostFormValues) {
  await requirePostManager(headers);

  await ensurePostExists(id);

  const updateData: Prisma.PostUpdateInput = {
    ...buildPostData(input),
  };

  if (input.authorIds) {
    updateData.authors = {
      deleteMany: {},
      create: input.authorIds.map((userId) => ({ userId })),
    };
  }

  if (input.tagIds && input.tagIds.length > 0) {
    updateData.tags = {
      deleteMany: {},
      create: input.tagIds.map((tagId) => ({ tagId })),
    };
  }

  const post = await prisma.post.update({
    data: updateData,
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
