'use client';

import { ListSkills } from '@/features/skill';
import { useSkills } from '@/features/skill/hooks';

export const SkillTab = () => {
  const { data, isLoading, error } = useSkills();
  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold tracking-wider">Skills</h1>
      <p className="mb-7 text-gray-500">
        Here are some of my technical skills, including programming languages, frameworks, tools,
        and other technologies I have worked with.
      </p>
      <ListSkills skills={data?.list ?? []} isLoading={isLoading} error={error} mode="public" />
    </div>
  );
};
