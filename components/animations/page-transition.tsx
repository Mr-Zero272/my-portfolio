'use client';

import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores/setting.store';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { RootFooter } from '../layouts/root/root-footer';

export const PageTransition = ({
  children,
  hasFooter = false,
  className = '',
}: {
  children: React.ReactNode;
  hasFooter?: boolean;
  className?: string;
}) => {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const { isTransitionPageEnabled } = useSettingsStore();

  if (!isTransitionPageEnabled) {
    return (
      <div className={cn('w-full bg-transparent pt-16', className)}>
        <div className="site-container mx-auto">{children}</div>
        {hasFooter && <RootFooter />}
      </div>
    );
  }

  return (
    <div
      className={cn('bg-background w-full flex-1 pt-16', className, {
        'overflow-hidden': isAnimating,
        'overflow-y-auto': !isAnimating,
      })}
    >
      <PageTransitionAnimation />
      <motion.div
        key={pathname + 'ani'}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        // exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, when: 'afterChildren', delay: 1.5 }}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
        className="flex h-full flex-col"
      >
        <div className="site-container mx-auto w-full flex-1">{children}</div>
        {hasFooter && <RootFooter />}
      </motion.div>
    </div>
  );
};

export const PageTransitionAnimation = () => {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <div key={pathname + 'pai'}>
        <motion.div
          className="bg-primary fixed top-0 right-full bottom-0 z-60 h-screen w-screen"
          initial={{ x: '100%', width: '100%' }}
          animate={{ x: '0%', width: '0%' }}
          exit={{ x: ['0%', '100%'], width: ['0%', '100%'] }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        <motion.div
          className="fixed top-0 right-full bottom-0 z-59 h-screen w-screen bg-white"
          initial={{ x: '100%', width: '100%' }}
          animate={{ x: '0%', width: '0%' }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
        />
        <motion.div
          className="fixed top-0 right-full bottom-0 z-58 h-screen w-screen bg-black"
          initial={{ x: '100%', width: '100%' }}
          animate={{ x: '0%', width: '0%' }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeInOut' }}
        />
      </div>
    </AnimatePresence>
  );
};
