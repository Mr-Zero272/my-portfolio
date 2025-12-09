'use client';

import { Portal } from '@radix-ui/react-portal';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect } from 'react';

export default function AnimatedCursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // smooth follow
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <Portal container={document.body}>
      {/* small dot */}
      <motion.div
        style={{ translateX: x, translateY: y }}
        className="pointer-events-none fixed z-[999999] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
      />

      {/* outline */}
      <motion.div
        style={{ translateX: springX, translateY: springY }}
        className="pointer-events-none fixed z-[999998] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"
      />
    </Portal>
  );
}
