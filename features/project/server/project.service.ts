import { getMainUserId } from '@/features/site-settings/server/main-user';
import {
    ApiErrorCode,
    buildListQuery,
    parseBooleanParam,
    parseEnumParam,
    throwApiError,
} from '@/lib/api';
import { requireAdmin } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slug';
import {
    GalleryImage,
    ProjectStatus,
    ProjectType,
    type Prisma,
} from '@prisma/client';
import { ProjectStatusEnum, ProjectTypeEnum } from '../constants';
import { ProjectFormValues } from '../data';

const PROJECT_SORTABLE_FIELDS = ['displayOrder', 'createdAt', 'name'] as const;
const PROJECT_SEARCH_FIELDS = ['name', 'slug'] as const;

const PROJECT_INCLUDE = {
  images: { include: { image: true } },
  user: { select: { id: true, name: true, email: true, image: true } },
} satisfies Prisma.ProjectInclude;

/** Public variant — owner user WITHOUT email (privacy, mirrors PUBLIC_POST_INCLUDE). */
const PUBLIC_PROJECT_INCLUDE = {
  images: { include: { image: true } },
  user: { select: { id: true, name: true, image: true } },
} satisfies Prisma.ProjectInclude;

/** Collapses the join rows (`images: ProjectImage[]`) into a plain `GalleryImage[]`. */
function toImages(rows: { image: GalleryImage }[]): GalleryImage[] {
  return rows.map(({ image }) => image);
}

function buildProjectData(input: ProjectFormValues, slug: string) {
  return {
    name: input.name,
    slug,
    description: input.description,
    responsibilities: input.responsibilities ?? undefined,
    type: input.type as ProjectType,
    status: input.status as ProjectStatus,
    demoUrl: input.demoUrl ?? undefined,
    sourceCodeUrl: input.sourceCodeUrl ?? undefined,
    technologies: input.technologies,
    databases: input.databases,
    startDate: input.startDate ? new Date(input.startDate) : null,
    endDate: input.endDate ? new Date(input.endDate) : null,
    isFeatured: input.isFeatured,
    displayOrder: input.displayOrder,
    isVisible: input.isVisible,
    metaTitle: input.metaTitle ?? undefined,
    metaDescription: input.metaDescription ?? undefined,
  };
}

export const projectService = {
  async getAll(headers: Headers, searchParams: URLSearchParams) {
    const { user } = await requireAdmin(headers);

    const query = buildListQuery<Prisma.ProjectWhereInput>(searchParams, {
      baseWhere: { userId: user.id },
      defaultSort: { displayOrder: 'asc' },
      filterFields: {
        type: { parse: parseEnumParam(Object.values(ProjectTypeEnum)) },
        status: { parse: parseEnumParam(Object.values(ProjectStatusEnum)) },
        isFeatured: { parse: parseBooleanParam },
        isVisible: { parse: parseBooleanParam },
      },
      searchFields: PROJECT_SEARCH_FIELDS,
      sortableFields: PROJECT_SORTABLE_FIELDS,
    });

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        include: PROJECT_INCLUDE,
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where: query.where,
      }),
      prisma.project.count({ where: query.where }),
    ]);

    return {
      projects: projects.map((project) => ({ ...project, images: toImages(project.images) })),
      pagination: query.pagination,
      total,
    };
  },

  async getPublicAll(searchParams: URLSearchParams) {
    const mainUserId = await getMainUserId();

    const query = buildListQuery<Prisma.ProjectWhereInput>(searchParams, {
      baseWhere: { isVisible: true },
      defaultSort: { displayOrder: 'asc' },
      filterFields: {
        type: { parse: parseEnumParam(Object.values(ProjectTypeEnum)) },
        status: { parse: parseEnumParam(Object.values(ProjectStatusEnum)) },
        isFeatured: { parse: parseBooleanParam },
      },
      searchFields: PROJECT_SEARCH_FIELDS,
      sortableFields: PROJECT_SORTABLE_FIELDS,
    });

    if (!mainUserId) {
      return {
        projects: [],
        pagination: query.pagination,
        total: 0,
      };
    }

    const where: Prisma.ProjectWhereInput = {
      ...query.where,
      userId: mainUserId,
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        include: PUBLIC_PROJECT_INCLUDE,
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects: projects.map((project) => ({ ...project, images: toImages(project.images) })),
      pagination: query.pagination,
      total,
    };
  },

  async getById(headers: Headers, id: string) {
    const { user } = await requireAdmin(headers);

    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
      include: PROJECT_INCLUDE,
    });

    if (!project) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Project record not found.' });
    }

    return { ...project, images: toImages(project.images) };
  },

  async create(headers: Headers, input: ProjectFormValues) {
    const { user } = await requireAdmin(headers);

    const slug = input.slug?.trim() || slugify(input.name);

    const data: Prisma.ProjectCreateInput = {
      ...buildProjectData(input, slug),
      user: { connect: { id: user.id } },
      images: {
        create: input.images.map((imageId) => ({ imageId })),
      },
    };

    const project = await prisma.project.create({
      data,
      include: PROJECT_INCLUDE,
    });

    return { ...project, images: toImages(project.images) };
  },

  async update(headers: Headers, id: string, input: Partial<ProjectFormValues>) {
    const { user } = await requireAdmin(headers);

    const existing = await prisma.project.findFirst({
      where: { id, userId: user.id },
      select: { id: true, name: true },
    });

    if (!existing) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Project record not found.' });
    }

    const data: Prisma.ProjectUpdateInput = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.slug !== undefined) {
      const slug = input.slug.trim();
      data.slug = slug || slugify(input.name ?? existing.name);
    }
    if (input.description !== undefined) data.description = input.description;
    if (input.responsibilities !== undefined) data.responsibilities = input.responsibilities ?? null;
    if (input.type !== undefined) data.type = input.type as ProjectType;
    if (input.status !== undefined) data.status = input.status as ProjectStatus;
    if (input.demoUrl !== undefined) data.demoUrl = input.demoUrl ?? null;
    if (input.sourceCodeUrl !== undefined) data.sourceCodeUrl = input.sourceCodeUrl ?? null;
    if (input.technologies !== undefined) data.technologies = input.technologies;
    if (input.databases !== undefined) data.databases = input.databases;
    if (input.startDate !== undefined) {
      data.startDate = input.startDate ? new Date(input.startDate) : null;
    }
    if (input.endDate !== undefined) data.endDate = input.endDate ? new Date(input.endDate) : null;
    if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;
    if (input.displayOrder !== undefined) data.displayOrder = input.displayOrder;
    if (input.isVisible !== undefined) data.isVisible = input.isVisible;
    if (input.metaTitle !== undefined) data.metaTitle = input.metaTitle ?? null;
    if (input.metaDescription !== undefined) data.metaDescription = input.metaDescription ?? null;

    if (input.images !== undefined) {
      data.images = {
        deleteMany: {},
        create: input.images.map((imageId) => ({ imageId })),
      };
    }

    const project = await prisma.project.update({
      data,
      where: { id },
      include: PROJECT_INCLUDE,
    });

    return { ...project, images: toImages(project.images) };
  },

  async delete(headers: Headers, id: string) {
    const { user } = await requireAdmin(headers);

    const existing = await prisma.project.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Project record not found.' });
    }

    await prisma.project.delete({ where: { id } });

    return { id };
  },
};
