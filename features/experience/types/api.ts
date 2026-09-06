import { BaseQuery, RequestConfig } from '@/types/api';
import { Experience, GalleryImage } from '@prisma/client';
import { ExperienceFormValues } from '../data';

export interface ExperienceWithAllRelations extends Experience {
  companyLogo?: GalleryImage | null;
}

export type GetExperiencesRequest = RequestConfig<undefined, BaseQuery, undefined>;

export type GetExperienceRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type CreateExperienceRequest = RequestConfig<undefined, undefined, ExperienceFormValues>;

export type UpdateExperienceRequest = RequestConfig<
  { id: string },
  undefined,
  Partial<ExperienceFormValues>
>;

export type DeleteExperienceRequest = RequestConfig<{ id: string }, undefined, undefined>;
