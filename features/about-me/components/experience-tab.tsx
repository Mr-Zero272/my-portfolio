'use client';

import { ListWorkExperience } from '@/features/experience';
import type { ExperienceWithAllRelations } from '@/features/experience/types';

type ExperienceTabProps = {
  experiences: ExperienceWithAllRelations[];
};

/**
 * Experience list. Data is fetched server-side (public API) and passed as props.
 */
export const ExperienceTab = ({ experiences }: ExperienceTabProps) => {
  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold tracking-wider">Experience</h1>
      <p className="mb-7 text-gray-500">
        Below are details of my university studies as well as information about the short courses I
        attended.
      </p>
      <ListWorkExperience experiences={experiences} mode="public" />
    </div>
  );
};
