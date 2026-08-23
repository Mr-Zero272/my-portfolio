import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_CLOSE_DELAY = 300;

type FormMode = 'create' | 'edit';

type FormActionState<T> = {
  payload: T | null;
  mode: FormMode | null;
  isOpen: boolean;
};

export const useFormActionState = <T>(closeDelay: number = DEFAULT_CLOSE_DELAY) => {
  const [state, setState] = useState<FormActionState<T>>({
    payload: null,
    mode: null,
    isOpen: false,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingClose = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const openCreate = useCallback(() => {
    clearPendingClose();

    setState({
      payload: null,
      mode: 'create',
      isOpen: true,
    });
  }, [clearPendingClose]);

  const openEdit = useCallback(
    (payload: T) => {
      clearPendingClose();

      setState({
        payload,
        mode: 'edit',
        isOpen: true,
      });
    },
    [clearPendingClose],
  );

  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));

    clearPendingClose();

    timeoutRef.current = setTimeout(() => {
      setState({
        payload: null,
        mode: null,
        isOpen: false,
      });

      timeoutRef.current = null;
    }, closeDelay);
  }, [closeDelay, clearPendingClose]);

  useEffect(() => clearPendingClose, [clearPendingClose]);

  return useMemo(
    () => ({
      ...state,
      openCreate,
      openEdit,
      close,
    }),
    [state, openCreate, openEdit, close],
  );
};
