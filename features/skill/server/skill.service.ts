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
import { ProficiencyLevel, SkillCategory, type Prisma } from '@prisma/client';
import { ProficiencyLevelEnum, SkillCategoryEnum } from '../constants';
import { SkillFormValues } from '../data';

const SKILL_SORTABLE_FIELDS = ['displayOrder', 'createdAt', 'name'] as const;
const SKILL_SEARCH_FIELDS = ['name'] as const;

const SKILL_INCLUDE = {
  icon: true,
} satisfies Prisma.SkillInclude;

export const skillService = {
  async getAll(headers: Headers, searchParams: URLSearchParams) {
    const { user } = await requireAdmin(headers);

    const query = buildListQuery<Prisma.SkillWhereInput>(searchParams, {
      baseWhere: { userId: user.id },
      defaultSort: { displayOrder: 'asc' },
      filterFields: {
        category: { parse: parseEnumParam(Object.values(SkillCategoryEnum)) },
        proficiency: { parse: parseEnumParam(Object.values(ProficiencyLevelEnum)) },
        isVisible: { parse: parseBooleanParam },
      },
      searchFields: SKILL_SEARCH_FIELDS,
      sortableFields: SKILL_SORTABLE_FIELDS,
    });

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        include: SKILL_INCLUDE,
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where: query.where,
      }),
      prisma.skill.count({ where: query.where }),
    ]);

    return {
      skills,
      pagination: query.pagination,
      total,
    };
  },

  async getPublicAll(searchParams: URLSearchParams) {
    const mainUserId = await getMainUserId();

    const query = buildListQuery<Prisma.SkillWhereInput>(searchParams, {
      baseWhere: { isVisible: true },
      defaultSort: { displayOrder: 'asc' },
      filterFields: {
        category: { parse: parseEnumParam(Object.values(SkillCategoryEnum)) },
        proficiency: { parse: parseEnumParam(Object.values(ProficiencyLevelEnum)) },
      },
      searchFields: SKILL_SEARCH_FIELDS,
      sortableFields: SKILL_SORTABLE_FIELDS,
    });

    if (!mainUserId) {
      return {
        skills: [],
        pagination: query.pagination,
        total: 0,
      };
    }

    const where: Prisma.SkillWhereInput = {
      ...query.where,
      userId: mainUserId,
    };

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        include: SKILL_INCLUDE,
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where,
      }),
      prisma.skill.count({ where }),
    ]);

    return {
      skills,
      pagination: query.pagination,
      total,
    };
  },

  async getById(headers: Headers, id: string) {
    const { user } = await requireAdmin(headers);

    const skill = await prisma.skill.findFirst({
      where: { id, userId: user.id },
      include: SKILL_INCLUDE,
    });

    if (!skill) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Skill record not found.' });
    }

    return skill;
  },

  async create(headers: Headers, input: SkillFormValues) {
    const { user } = await requireAdmin(headers);

    const skill = await prisma.skill.create({
      data: {
        name: input.name,
        proficiency: input.proficiency as ProficiencyLevel,
        category: input.category as SkillCategory,
        iconId: input.iconId ?? undefined,
        description: input.description ?? undefined,
        yearsOfExperience: input.yearsOfExperience ?? undefined,
        displayOrder: input.displayOrder,
        isVisible: input.isVisible,
        userId: user.id,
      },
      include: SKILL_INCLUDE,
    });

    return skill;
  },

  async update(headers: Headers, id: string, input: Partial<SkillFormValues>) {
    const { user } = await requireAdmin(headers);

    await ensureSkillExists(id, user.id);

    const data: Prisma.SkillUpdateInput = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.proficiency !== undefined) data.proficiency = input.proficiency as ProficiencyLevel;
    if (input.category !== undefined) data.category = input.category as SkillCategory;
    if (input.iconId !== undefined) {
      data.icon = input.iconId ? { connect: { id: input.iconId } } : { disconnect: true };
    }
    if (input.description !== undefined) data.description = input.description ?? null;
    if (input.yearsOfExperience !== undefined) {
      data.yearsOfExperience = input.yearsOfExperience ?? null;
    }
    if (input.displayOrder !== undefined) data.displayOrder = input.displayOrder;
    if (input.isVisible !== undefined) data.isVisible = input.isVisible;

    const skill = await prisma.skill.update({
      data,
      where: { id },
      include: SKILL_INCLUDE,
    });

    return skill;
  },

  async delete(headers: Headers, id: string) {
    const { user } = await requireAdmin(headers);

    await ensureSkillExists(id, user.id);
    await prisma.skill.delete({ where: { id } });

    return { id };
  },

  async bulkSort(headers: Headers, items: Array<{ id: string; displayOrder: number }>) {
    const { user } = await requireAdmin(headers);

    await prisma.$transaction(
      items.map((item) =>
        prisma.skill.updateMany({
          where: { id: item.id, userId: user.id },
          data: { displayOrder: item.displayOrder },
        }),
      ),
    );

    return { success: true };
  },
};

async function ensureSkillExists(id: string, userId: string) {
  const skill = await prisma.skill.findFirst({
    select: { id: true },
    where: { id, userId },
  });

  if (!skill) {
    throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Skill record not found.' });
  }
}
