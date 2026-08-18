import { GalleryImage, Profile } from '@/lib/generated/prisma/client';
import { RequestConfig } from '@/types/api';
import { ProfileFormValues } from '../schemas';

export interface ProfileWithAllRelations extends Profile {
  ogImage?: GalleryImage | null;
  heroImage?: GalleryImage | null;
}

export type GetProfileRequest = RequestConfig<undefined, undefined, undefined>;

export type UpdateProfileRequest = RequestConfig<undefined, undefined, Partial<ProfileFormValues>>;
