import { GalleryImage, Skill } from '@/lib/generated/prisma/client';
import { BaseQuery, RequestConfig } from '@/types/api';
import { BulkSortSkillsInput, SkillFormValues } from '../data';

export interface SkillWithAllRelations extends Skill {
  icon?: GalleryImage | null;
}

export type GetSkillsRequest = RequestConfig<{ id: string }, BaseQuery, undefined>;

export type GetSkillRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type CreateSkillRequest = RequestConfig<undefined, undefined, SkillFormValues>;

export type UpdateSkillRequest = RequestConfig<{ id: string }, undefined, Partial<SkillFormValues>>;

export type DeleteSkillRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type BulkSortSkillsRequest = RequestConfig<undefined, undefined, BulkSortSkillsInput>;

