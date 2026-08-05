import { parseAsString, useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';

export type FormMode = 'create' | 'edit';

export const useFormState = <T extends { id: string }>() => {
  const [id, setId] = useQueryState('id', parseAsString);
  const [isCreating, setIsCreating] = useState(false);

  // cached payload not source of truth
  const [cache, setCache] = useState<Record<string, T>>({});

  const isOpen = isCreating || id !== null;
  const mode: FormMode = isCreating ? 'create' : 'edit';

  const create = useCallback(() => {
    setIsCreating(true);
    setId(null);
  }, [setId]);

  const edit = useCallback(
    (payload: T) => {
      setIsCreating(false);
      setCache((c) => ({ ...c, [payload.id]: payload }));
      setId(payload.id);
    },
    [setId]
  );

  const close = useCallback(() => {
    setIsCreating(false);
    setId(null);
  }, [setId]);

  return {
    isOpen,
    mode,
    id,
    cachedPayload: id ? (cache[id] ?? null) : null,
    create,
    edit,
    close
  };
};
