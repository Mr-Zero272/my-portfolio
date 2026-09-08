// hooks/use-animated-icon.ts
import type { AnimatedIconHandle } from '@/types/animated-icon';
import { useCallback, useRef } from 'react';

export function useAnimatedIcon<T extends AnimatedIconHandle = AnimatedIconHandle>() {
  const iconRef = useRef<T>(null);

  const onMouseEnter = useCallback(() => {
    iconRef.current?.startAnimation();
  }, []);

  const onMouseLeave = useCallback(() => {
    iconRef.current?.stopAnimation();
  }, []);

  return { iconRef, onMouseEnter, onMouseLeave };
}
