import { BaseQuery, RequestConfig } from '@/types/api';
import { ExperienceFormValues } from '../schemas';

export type GetExperiencesRequest = RequestConfig<undefined, BaseQuery, undefined>;

export type GetExperienceRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type CreateExperienceRequest = RequestConfig<undefined, undefined, ExperienceFormValues>;

export type UpdateExperienceRequest = RequestConfig<{ id: string }, undefined, Partial<ExperienceFormValues>>;

export type DeleteExperienceRequest = RequestConfig<{ id: string }, undefined, undefined>;
