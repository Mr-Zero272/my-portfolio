import { Button } from '@/components/ui/button';
import type { ListResponse } from '@/types/api';
import { handleError } from '@/utils';
import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Undo2Icon } from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────

interface PendingDelete<TItem = unknown> {
  item: TItem;
  request: unknown;
}

export interface OptimisticDeleteSessionConfig<TItem = unknown> {
  /** Stable session ID — same ID batches deletes into one toast (e.g. `tasks-${projectKey}`) */
  sessionId: string;
  /** Human-readable entity name for toast messages (e.g. "Task", "Phase") */
  entityName: string;
  /** Delete API function — receives the mapped request object */
  deleteFn: (request: unknown) => Promise<unknown>;
  /** Map domain item → delete API request */
  mapToRequest: (item: TItem) => unknown;
  /** Extract unique ID from item for dedup */
  getId: (item: TItem) => string;
  /** Toast duration in ms before API is called. Default: 3000 */
  toastDuration?: number;
}

interface DeleteSession<TItem = unknown> {
  pendingItems: Map<string, PendingDelete<TItem>>;
  /** Snapshot of the list cache BEFORE any deletes in this session */
  snapshot: ListResponse<TItem> | null;
  /** The list query key used when the snapshot was taken */
  listQueryKey: QueryKey | null;
  /** Reference to the React Query client (singleton on client) */
  queryClient: QueryClient | null;
  timerId: ReturnType<typeof setTimeout> | null;
  config: OptimisticDeleteSessionConfig<TItem>;
}

// ─── Helpers ─────────────────────────────────────────────────────

function isNotFoundError(error: unknown): boolean {
  if (isAxiosError(error) && error.response?.status === 404) {
    return true;
  }
  return false;
}

// ─── Store ───────────────────────────────────────────────────────

function createOptimisticDeleteStore() {
  // Using `any` internally to avoid generic variance issues — the public API is typed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessions = new Map<string, DeleteSession<any>>();

  function getOrCreateSession<TItem>(
    config: OptimisticDeleteSessionConfig<TItem>,
    queryClient: QueryClient,
  ): DeleteSession<TItem> {
    const existing = sessions.get(config.sessionId);
    if (existing) {
      // Keep queryClient reference fresh (it's a singleton, but may change in tests)
      existing.queryClient = queryClient;
      return existing as DeleteSession<TItem>;
    }

    const session: DeleteSession<TItem> = {
      pendingItems: new Map(),
      snapshot: null,
      listQueryKey: null,
      queryClient,
      timerId: null,
      config,
    };

    sessions.set(config.sessionId, session);
    return session;
  }

  /**
   * Queue an item for optimistic deletion.
   * - Snapshot is taken on first item only (represents state BEFORE any deletes).
   * - The item is immediately removed from the cache.
   * - A batched toast is shown/updated with an Undo button.
   * - A timer is started/restarted. After it expires, flush() is called.
   */
  function enqueue<TItem>(
    config: OptimisticDeleteSessionConfig<TItem>,
    item: TItem,
    listQueryKey: QueryKey,
    queryClient: QueryClient,
  ) {
    const session = getOrCreateSession(config, queryClient);
    const id = config.getId(item);
    const duration = config.toastDuration ?? 3000;
    const isFirst = session.pendingItems.size === 0;

    // Take snapshot of the CURRENT cache state on first delete.
    // This captures the state before any items in this session were removed.
    if (isFirst) {
      session.snapshot = (queryClient.getQueryData(listQueryKey) as ListResponse<TItem>) ?? null;
      session.listQueryKey = listQueryKey;
    }

    // Add to pending queue
    session.pendingItems.set(id, { item, request: config.mapToRequest(item) });

    // Optimistically remove the newly queued item from the current cache.
    // We only filter by this item's ID because the cache may already reflect
    // previous removals from earlier enqueue calls in the same session.
    // The snapshot (taken on first call) preserves the full original state for undo.
    queryClient.setQueryData<ListResponse<TItem>>(listQueryKey, (old) => {
      if (!old) return old;
      return {
        ...old,
        list: old.list.filter((i) => config.getId(i) !== id),
        meta: old?.meta
          ? {
              ...old.meta,
              pagination: {
                ...old.meta.pagination,
                limit: old.meta.pagination?.limit ?? 10,
                page: old.meta.pagination?.page ?? 1,
                totalPages: old.meta.pagination?.totalPages ?? 1,
                hasNextPage: old.meta.pagination?.hasNextPage ?? false,
                hasPreviousPage: old.meta.pagination?.hasPreviousPage ?? false,
                total: Math.max(0, old?.meta?.pagination?.total ?? 0 - 1),
              },
            }
          : undefined,
      };
    });

    // Update the list query key (may change between deletes if user navigates)
    session.listQueryKey = listQueryKey;

    // Show / update toast (timeout: 0 = never auto-dismiss; we manage our own timer)
    const count = session.pendingItems.size;
    const title =
      count === 1 ? `${config.entityName} deleted` : `${count} ${config.entityName}s deleted`;

    toast.info(title, {
      id: config.sessionId,
      description: 'Undoing in 3s unless cancelled...',
      action: (
        <Button size="sm" onClick={() => undo(config.sessionId)} className="ml-auto">
          <Undo2Icon />
          Undo
        </Button>
      ),
    });

    // Reset timer (restart on each new delete)
    if (session.timerId) clearTimeout(session.timerId);
    session.timerId = setTimeout(() => flush(config.sessionId), duration);

    return { count };
  }

  /**
   * Undo all pending deletes in a session.
   * Restores the cache snapshot, dismisses toast, clears timer.
   */
  function undo(sessionId: string) {
    const session = sessions.get(sessionId);
    if (!session || session.pendingItems.size === 0) return;

    // Clear timer
    if (session.timerId) {
      clearTimeout(session.timerId);
      session.timerId = null;
    }

    // Restore cache to original snapshot
    if (session.snapshot && session.listQueryKey && session.queryClient) {
      session.queryClient.setQueryData(session.listQueryKey, session.snapshot);
    }

    // Dismiss toast
    toast.dismiss(sessionId);

    // Clean up session
    sessions.delete(sessionId);
  }

  /**
   * Execute all pending API delete calls.
   * Called when the timer expires (user did not click Undo).
   * On partial/complete failure: restores cache snapshot + shows error toast.
   * 404 errors are treated as success (item already deleted server-side).
   */
  async function flush(sessionId: string) {
    const session = sessions.get(sessionId);
    if (!session || session.pendingItems.size === 0) return;

    const items = Array.from(session.pendingItems.values());
    const { deleteFn, entityName } = session.config;
    const queryClient = session.queryClient;
    const snapshot = session.snapshot;
    const listQueryKey = session.listQueryKey;

    // Close toast immediately (timer has already expired)
    toast.dismiss(sessionId);

    // Remove session — flush runs once, win or lose
    sessions.delete(sessionId);

    // Execute all deletes in parallel
    const results = await Promise.allSettled(items.map((p) => deleteFn(p.request)));

    // Separate real failures from 404s
    const failures = results.filter((r) => r.status === 'rejected');
    const realFailures = failures.filter(
      (f) => f.status === 'rejected' && !isNotFoundError(f.reason),
    );

    if (realFailures.length > 0) {
      // Some deletes genuinely failed — restore cache and show error
      if (snapshot && listQueryKey && queryClient) {
        queryClient.setQueryData(listQueryKey, snapshot);
        queryClient.invalidateQueries({ queryKey: listQueryKey, exact: false });

        handleError({
          error: realFailures[0].reason,
          customMessage: `Failed to delete ${realFailures.length} ${entityName.toLowerCase()}${realFailures.length > 1 ? 's' : ''}`,
          withToast: true,
        });
      }
    } else if (queryClient && listQueryKey) {
      // All succeeded (or were 404s — already gone) → invalidate to sync
      queryClient.invalidateQueries({ queryKey: listQueryKey, exact: false });
    }
  }

  /** Check if a session has pending deletes */
  function hasPending(sessionId: string): boolean {
    const session = sessions.get(sessionId);
    return (session?.pendingItems.size ?? 0) > 0;
  }

  /** Get pending count for a session */
  function getPendingCount(sessionId: string): number {
    return sessions.get(sessionId)?.pendingItems.size ?? 0;
  }

  return { enqueue, undo, flush, hasPending, getPendingCount };
}

export const optimisticDeleteStore = createOptimisticDeleteStore();
