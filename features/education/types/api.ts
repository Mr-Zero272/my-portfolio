import { BaseQuery, RequestConfig } from '@/types/api';
import { EducationFormValues } from '../schemas';

export type GetEducationsRequest = RequestConfig<undefined, BaseQuery, undefined>;

export type GetEducationRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type CreateEducationRequest = RequestConfig<undefined, undefined, EducationFormValues>;

export type UpdateEducationRequest = RequestConfig<{ id: string }, undefined, Partial<EducationFormValues>>;

export type DeleteEducationRequest = RequestConfig<{ id: string }, undefined, undefined>;
