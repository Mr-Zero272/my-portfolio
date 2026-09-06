'use client';

import { useOptimisticDelete } from '@/hooks/use-optimistic-delete';
import { Tag } from '@prisma/client';
import { tagApi } from '../services';

export const useOptimisticDeleteTag = () => {
  return useOptimisticDelete<Tag>({
    config: {
      sessionId: 'tags',
      entityName: 'Tag',
      deleteFn: tagApi.delete as (request: unknown) => Promise<unknown>,
      mapToRequest: (tag) => ({
        path: { id: tag.id },
      }),
      getId: (tag) => tag.id,
    },
  });
};
