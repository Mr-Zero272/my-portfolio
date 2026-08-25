import { Experience } from '@/lib/generated/prisma/client';
import { parseToExperiencePositionIconType } from '../../constants';
import { ExperienceFormValues } from './schema';

export const toExperienceFormValues = (experience: Experience): ExperienceFormValues => {
  return {
    companyName: experience.companyName,
    companyLogoId: experience.companyLogoId,
    isCurrentEmployer: experience.isCurrentEmployer,
    positions: experience.positions.map((position) => ({
      title: position.title,
      employmentType: position.employmentType,
      location: position.location,
      startDate: new Date(position.startDate).toISOString(),
      endDate: position.endDate ? new Date(position.endDate).toISOString() : null,
      description: position.description,
      icon: parseToExperiencePositionIconType(position.icon),
      skills: position.skills,
    })),
    displayOrder: experience.displayOrder,
    isVisible: experience.isVisible,
  };
};
