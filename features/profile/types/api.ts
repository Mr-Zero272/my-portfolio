import { RequestConfig } from '@/types/api';
import { ProfileFormValues } from '../schemas';

export type GetProfileRequest = RequestConfig<undefined, undefined, undefined>;

export type UpdateProfileRequest = RequestConfig<undefined, undefined, Partial<ProfileFormValues>>;
