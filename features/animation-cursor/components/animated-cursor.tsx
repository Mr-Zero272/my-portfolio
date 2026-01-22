'use client';

import { Portal } from '@radix-ui/react-portal';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

export default function AnimatedCursor({ enabled, type }: { enabled: boolean; type: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isClicking, setIsClicking] = useState(false);

  // smooth follow
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  useEffect(() => {
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (!enabled) return;
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [enabled, x, y]);

  const renderCursor = useCallback(() => {
    switch (type) {
      case 'geometric':
        return (
          <>
            <motion.div
              style={{ translateX: springX, translateY: springY, opacity: enabled ? 1 : 0 }}
              animate={{
                scale: isClicking ? 0.5 : 1,
                rotate: isClicking ? 180 : 45,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="pointer-events-none fixed z-999998 size-6 -translate-x-1/2 -translate-y-1/2 border border-primary bg-primary/20 backdrop-invert"
            />

            <motion.div
              style={{ translateX: x, translateY: y, opacity: enabled ? 1 : 0 }}
              animate={{
                scale: isClicking ? 1.5 : 1,
                rotate: isClicking ? -45 : 0,
              }}
              className="pointer-events-none fixed z-999999 size-3 -translate-x-1/2 -translate-y-1/2 border-2 border-primary bg-background"
            />
          </>
        );
      case 'glow':
        return (
          <>
            <motion.div
              style={{ translateX: springX, translateY: springY, opacity: enabled ? 1 : 0 }}
              animate={{
                scale: isClicking ? 1.5 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="pointer-events-none fixed z-999998 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-xl"
            />
            <motion.div
              style={{ translateX: x, translateY: y, opacity: enabled ? 1 : 0 }}
              animate={{
                scale: isClicking ? 0.5 : 1,
              }}
              className="pointer-events-none fixed z-999999 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
            />
          </>
        );
        return (
          <>
            <motion.div
              style={{ translateX: x, translateY: y, opacity: enabled ? 1 : 0 }}
              animate={{ scale: isClicking ? 0.7 : 1 }}
              className="pointer-events-none fixed z-999999 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
            />
            <motion.div
              style={{ translateX: springX, translateY: springY, opacity: enabled ? 1 : 0 }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="pointer-events-none fixed z-999998 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"
            />
          </>
        );
      default:
        return (
          <>
            {/* small dot */}
            <motion.div
              style={{ translateX: x, translateY: y, opacity: enabled ? 1 : 0 }}
              animate={{ scale: isClicking ? 0.8 : 1 }}
              className="pointer-events-none fixed z-999999 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
            />

            {/* outline */}
            <motion.div
              style={{ translateX: springX, translateY: springY, opacity: enabled ? 1 : 0 }}
              animate={{ scale: isClicking ? 0.6 : 1 }}
              className="pointer-events-none fixed z-999998 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"
            />
          </>
        );
    }
  }, [type, enabled, x, y, springX, springY, isClicking]);

  return <Portal container={typeof document !== 'undefined' ? document.body : null}>{renderCursor()}</Portal>;
}
