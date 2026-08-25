'use client';

import { ListWorkExperience, useExperiences } from '@/features/experience';

export const ExperienceTab = () => {
  const { data, isLoading: isLoadingExperiences, error: errorExperiences } = useExperiences();

  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold tracking-wider">Experience</h1>
      <p className="mb-7 text-gray-500">
        Below are details of my university studies as well as information about the short courses I
        attended.
      </p>
      <ListWorkExperience
        experiences={data?.list ?? []}
        isLoading={isLoadingExperiences}
        error={errorExperiences}
        mode="public"
      />
    </div>
  );
};
