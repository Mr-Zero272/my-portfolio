'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import PulseRings from './pulse-rings';

const MorphingVideo = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Overlay che UI khác */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-40 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Video circle → fullscreen */}
      <motion.div
        layout
        onClick={() => setExpanded(!expanded)}
        className={`z-50 cursor-pointer overflow-hidden ${expanded ? 'fixed inset-0' : 'relative h-32 w-32'} `}
        animate={{
          borderRadius: expanded ? '0%' : '50%',
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <video
          src="/videos/zenitsu-lightning-nichirin-demon-slayer-moewalls-com.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />

        {/* Ripple animation (chỉ khi idle) */}
        {!expanded && <PulseRings />}
      </motion.div>
    </>
  );
};

export default MorphingVideo;
