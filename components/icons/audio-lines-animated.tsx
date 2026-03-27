'use client';

import { cn } from '@/lib/utils';
import type { HTMLMotionProps, Variants } from 'motion/react';
import { motion, useReducedMotion } from 'motion/react';

interface AudioLinesAnimatedIconProps extends HTMLMotionProps<'div'> {
  size?: number;
  duration?: number;
}

const AudioLinesAnimatedIcon = ({ className, size = 24, duration = 1, ref, ...props }: AudioLinesAnimatedIconProps) => {
  const reduced = useReducedMotion();

  const barVariants: Variants = {
    normal: { scaleY: 1, opacity: 1 },
    animate: (i: number) => ({
      scaleY: [1, 1.4, 0.6, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 0.9 * duration,
        repeat: Infinity,
        delay: i * 0.2,
        ease: 'easeInOut',
      },
    }),
  };

  const paths = ['M2 10v3', 'M6 6v11', 'M10 3v18', 'M14 8v7', 'M18 5v13', 'M22 10v3'];

  return (
    <motion.div ref={ref} className={cn('inline-flex items-center justify-center', className)} {...props}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="normal"
        animate={reduced ? 'normal' : 'animate'}
      >
        {paths.map((d, i) => (
          <motion.path key={i} d={d} variants={barVariants} custom={i} style={{ originY: 0.5 }} />
        ))}
      </motion.svg>
    </motion.div>
  );
};

export default AudioLinesAnimatedIcon;
