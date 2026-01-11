'use client';

import { useSidebar } from '@/components/contexts/sidebar-context';
import { navbarRoutesInfo } from '@/constants/nav-routes';
import { cn } from '@/lib/utils';
import useLayoutState from '@/store/use-layout-state';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

export const BottomNavBar = () => {
  const lastScrollY = useRef(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const setBottomNavOpen = useLayoutState((state) => state.setIsBottomNavOpen);
  const pathname = usePathname();
  const { isExpanded, isMobile } = useSidebar();

  const onScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const diff = scrollY - lastScrollY.current;
    const threshold = 10;
    if (Math.abs(diff) < threshold) return;
    setDirection(diff > 0 ? 'down' : 'up');
    setBottomNavOpen(diff > 0);
    lastScrollY.current = scrollY;
  }, [setBottomNavOpen]);

  useEffect(() => {
    if (isExpanded && isMobile) {
      setBottomNavOpen(false);
    }
  }, [isExpanded, isMobile, setBottomNavOpen]);

  useEventListener('scroll', onScroll);

  const finalDirection = isExpanded && isMobile ? 'down' : direction;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{
        y: finalDirection === 'down' ? 100 : 0,
        opacity: finalDirection === 'down' ? 0 : 1,
      }}
      transition={{
        duration: 0.25,
        ease: 'easeOut',
      }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.2 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 20 || info.velocity.y > 10) {
          setDirection('down');
        }
      }}
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-row gap-2 rounded-full border border-neutral-200/20 bg-white/80 p-2 shadow-lg backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-black/80"
    >
      {navbarRoutesInfo.map((route) => {
        const isActive = pathname === route.route || (pathname.includes(route.route) && route.route.length > 1);
        const Icon = route.icon;

        return (
          <Link
            key={route.route}
            href={route.route}
            className={cn(
              'relative flex size-12 items-center justify-center rounded-full text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
              isActive && 'text-primary dark:text-primary',
            )}
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-bubble"
                className="absolute inset-0 rounded-full bg-neutral-100 dark:bg-neutral-800"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={isActive ? 'active' : 'inactive'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <Icon className="size-6" />
              </motion.div>
            </AnimatePresence>
            {isActive && (
              <motion.span
                layoutId="bottom-nav-indicator"
                className="absolute -bottom-1 size-1 rounded-full bg-primary"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        );
      })}
    </motion.div>
  );
};
