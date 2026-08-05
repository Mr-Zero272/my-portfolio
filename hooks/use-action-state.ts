import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_CLOSE_DELAY = 300;

export const useActionState = <T>(closeDelay: number = DEFAULT_CLOSE_DELAY) => {
  const [payload, setPayload] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingClose = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const open = useCallback(
    (newPayload: T) => {
      // Nếu đang có timeout chờ null hóa payload cũ (reopen khi đang đóng) -> hủy nó
      clearPendingClose();
      setPayload(newPayload);
      setIsOpen(true);
    },
    [clearPendingClose],
  );

  const close = useCallback(() => {
    setIsOpen(false); // trigger exit animation ngay
    clearPendingClose();
    timeoutRef.current = setTimeout(() => {
      setPayload(null); // chỉ dọn payload sau khi animation (dự kiến) xong
      timeoutRef.current = null;
    }, closeDelay);
  }, [closeDelay, clearPendingClose]);

  useEffect(() => clearPendingClose, [clearPendingClose]); // cleanup on unmount

  return useMemo(() => ({ payload, isOpen, open, close }), [payload, isOpen, open, close]);
};
