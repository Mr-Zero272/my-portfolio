'use client';

import { EducationList } from '@/features/education/components';
import { useEducations } from '@/features/education/hooks';

export const EducationTab = () => {
  const { data, isLoading: isLoadingEducations, error: errorEducations } = useEducations();

  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold tracking-wider">Education</h1>
      <p className="mb-7 text-gray-500">
        Below are details of my university studies as well as information about the short courses I
        attended.
      </p>
      <EducationList
        data={data?.list ?? []}
        isLoading={isLoadingEducations}
        error={errorEducations}
        mode="default"
      />
    </div>
  );
};
