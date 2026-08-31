'use client';

import { useOptimisticDelete } from '@/hooks/use-optimistic-delete';
import { skillApi } from '../../services';
import { SkillWithAllRelations } from '../../types';

export const useOptimisticDeleteSkill = () => {
  return useOptimisticDelete<SkillWithAllRelations>({
    config: {
      sessionId: 'skills',
      entityName: 'Skill',
      deleteFn: skillApi.delete as (request: unknown) => Promise<unknown>,
      mapToRequest: (skill) => ({
        path: { id: skill.id },
      }),
      getId: (skill) => skill.id,
    },
  });
};
