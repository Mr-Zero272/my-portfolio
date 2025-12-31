'use client';

import { motion } from 'motion/react';
import { SVGProps } from 'react';

export function AudioWaveformIcon(props: SVGProps<SVGSVGElement>) {
  const bars = [
    { h: 10, delay: 0 },
    { h: 6, delay: 0.1 },
    { h: 12, delay: 0.2 },
    { h: 6, delay: 0.1 },
    { h: 10, delay: 0 },
  ];

  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      {bars.map((bar, i) => (
        <motion.rect
          key={i}
          x={4 + i * 4}
          y={24 - bar.h}
          width={2}
          height={bar.h}
          rx={1}
          fill="currentColor"
          style={{
            transformOrigin: '50% 100%',
          }}
          animate={{
            scaleY: [1, 1.6, 1],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: bar.delay,
          }}
        />
      ))}
    </svg>
  );
}
