'use client';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';

const PageTransitionAnimation = () => {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <div key={pathname + 'pai'}>
        <motion.div
          className="bg-primary fixed top-0 right-full bottom-0 z-[60] h-screen w-screen"
          initial={{ x: '100%', width: '100%' }}
          animate={{ x: '0%', width: '0%' }}
          exit={{ x: ['0%', '100%'], width: ['0%', '100%'] }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        <motion.div
          className="fixed top-0 right-full bottom-0 z-[59] h-screen w-screen bg-white"
          initial={{ x: '100%', width: '100%' }}
          animate={{ x: '0%', width: '0%' }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
        />
        <motion.div
          className="fixed top-0 right-full bottom-0 z-[58] h-screen w-screen bg-black"
          initial={{ x: '100%', width: '100%' }}
          animate={{ x: '0%', width: '0%' }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeInOut' }}
        />
      </div>
    </AnimatePresence>
  );
};

export default PageTransitionAnimation;
