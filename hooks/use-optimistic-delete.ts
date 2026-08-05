'use client';

import {
  type OptimisticDeleteSessionConfig,
  optimisticDeleteStore,
} from '@/stores/optimistic-delete.store';
import type { QueryKey } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────

interface UseOptimisticDeleteOptions<TItem> {
  config: OptimisticDeleteSessionConfig<TItem>;
}

interface UseOptimisticDeleteResult<TItem> {
  /** Queue an item for optimistic deletion. Pass the current list query key. */
  delete: (item: TItem, listQueryKey: QueryKey) => void;
  /** Check if the session has pending deletes */
  hasPending: () => boolean;
  /** Get the number of pending deletes in this session */
  pendingCount: () => number;
}

// ─── Hook ────────────────────────────────────────────────────────

/**
 * Domain-agnostic hook for optimistic delete with undo support.
 *
 * Features:
 * - Immediately removes item from React Query cache (optimistic UI)
 * - Shows a batched toast with Undo button
 * - Delays actual API call until toast expires (3s default)
 * - Undo restores cache snapshot, cancels API call
 * - Survives component unmount / navigation (store is a module singleton)
 * - Multiple deletes batch into a single toast + undo restores all
 *
 * @example
 * ```ts
 * const { delete: optimisticDelete } = useOptimisticDelete({
 *   config: {
 *     sessionId: 'tasks-myProject',
 *     entityName: 'Task',
 *     deleteFn: taskApi.delete,
 *     mapToRequest: (task) => ({ path: { projectKey, id: task.id } }),
 *     getId: (task) => task.id,
 *   },
 * });
 *
 * // In column onClick:
 * optimisticDelete(task, taskQueryKeys.list(request));
 * ```
 */
export function useOptimisticDelete<TItem>(
  options: UseOptimisticDeleteOptions<TItem>,
): UseOptimisticDeleteResult<TItem> {
  const queryClient = useQueryClient();
  const { config } = options;

  const deleteItem = useCallback(
    (item: TItem, listQueryKey: QueryKey) => {
      optimisticDeleteStore.enqueue(config, item, listQueryKey, queryClient);
    },
    [config, queryClient],
  );

  const hasPending = useCallback(() => {
    return optimisticDeleteStore.hasPending(config.sessionId);
  }, [config.sessionId]);

  const pendingCount = useCallback(() => {
    return optimisticDeleteStore.getPendingCount(config.sessionId);
  }, [config.sessionId]);

  return { delete: deleteItem, hasPending, pendingCount };
}
