// hooks/useCursor.ts
import { CursorType, useCursorStore } from '@/features/animation-cursor/store';
import { useEffect, useRef } from 'react';

export function useCursor(type: CursorType, data?: any) {
  const ref = useRef<HTMLElement | null>(null);
  const setType = useCursorStore((s) => s.setType);
  const reset = useCursorStore((s) => s.reset);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleEnter = () => setType(type, data);
    const handleLeave = () => reset();

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [ref, type, data, setType, reset]);

  return ref;
}
