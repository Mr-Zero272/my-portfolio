'use client';

import { motion } from 'motion/react';

const PulseRings = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-white/30"
          animate={{
            scale: [1, 1.6],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.6,
          }}
        />
      ))}
    </>
  );
};

export default PulseRings;
