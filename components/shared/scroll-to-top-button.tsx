'use client';

import useLayoutState from '@/store/use-layout-state';
import { ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isBottomNavOpen = useLayoutState((state) => state.isBottomNavOpen);

  const toggleVisibility = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [setIsVisible]);

  useEventListener('scroll', toggleVisibility);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed right-5 bottom-5 z-50 flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/80 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:outline-none md:right-16 md:bottom-10 md:size-12 dark:bg-primary dark:ring-offset-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: isBottomNavOpen ? 0 : -65 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          aria-label="Scroll to top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="size-3 md:size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
