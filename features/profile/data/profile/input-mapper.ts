import { Profile } from '@/lib/generated/prisma/client';
import { ProfileFormValues } from './schema';

export const toProfileFormValue = (profile: Profile): ProfileFormValues => {
  return {
    name: profile.name ?? '',
    phone: profile.phone ?? '',
    nationality: profile.nationality ?? '',
    address: profile.address ?? '',
    yoe: profile.yoe ?? 0,
    resumePath: profile.resumePath ?? '',
    tagline: profile.tagline ?? '',
    bio: profile.bio ?? '',
    description: profile.description ?? '',
    freelanceAvailable: profile.freelanceAvailable ?? true,
    languages: profile.languages ?? ['Vietnamese', 'English'],
    rotatingWords: profile.rotatingWords ?? ['Web', 'Software', 'Mainframe'],
    metaTitle: profile.metaTitle ?? '',
    metaDescription: profile.metaDescription ?? '',
    ogImageId: profile.ogImageId ?? '',
    heroImageId: profile.heroImageId ?? '',
    cvUrl: profile.cvUrl ?? '',
    isActive: profile.isActive ?? true,
  };
};
