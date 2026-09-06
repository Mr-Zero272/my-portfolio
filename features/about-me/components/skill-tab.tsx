'use client';

import { ListSkills } from '@/features/skill';
import type { SkillWithAllRelations } from '@/features/skill/types';

type SkillTabProps = {
  skills: SkillWithAllRelations[];
};

/**
 * Skills grid. Data is fetched server-side (public API) and passed as props.
 */
export const SkillTab = ({ skills }: SkillTabProps) => {
  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold tracking-wider">Skills</h1>
      <p className="mb-7 text-gray-500">
        Here are some of my technical skills, including programming languages, frameworks, tools,
        and other technologies I have worked with.
      </p>
      <ListSkills skills={skills} isLoading={false} mode="public" />
    </div>
  );
};
