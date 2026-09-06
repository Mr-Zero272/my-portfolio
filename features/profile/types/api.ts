import { RequestConfig } from '@/types/api';
import { GalleryImage, Profile } from '@prisma/client';
import { ProfileFormValues } from '../data';

export interface ProfileWithAllRelations extends Profile {
  ogImage?: GalleryImage | null;
  heroImage?: GalleryImage | null;
}

export type GetProfileRequest = RequestConfig<undefined, undefined, undefined>;

export type UpdateProfileRequest = RequestConfig<undefined, undefined, Partial<ProfileFormValues>>;
