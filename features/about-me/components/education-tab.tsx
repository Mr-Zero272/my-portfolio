'use client';

import { EducationList } from '@/features/education/components';
import type { Education } from '@prisma/client';

type EducationTabProps = {
  educations: Education[];
};

/**
 * Education list. Data is fetched server-side (public API) and passed as props.
 */
export const EducationTab = ({ educations }: EducationTabProps) => {
  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold tracking-wider">Education</h1>
      <p className="mb-7 text-gray-500">
        Below are details of my university studies as well as information about the short courses I
        attended.
      </p>
      <EducationList data={educations} isLoading={false} error={null} mode="default" />
    </div>
  );
};
