'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Footer from '../layouts/components/footer';
import PageTransitionAnimation from './page-transition-animation';

const PageTransition = ({
  children,
  noFooter = false,
  className = '',
}: {
  children: React.ReactNode;
  noFooter?: boolean;
  className?: string;
}) => {
  const pathname = usePathname();
  return (
    <div className={cn('bg-background w-full overflow-y-auto pt-16', className)}>
      <PageTransitionAnimation />
      <motion.div
        key={pathname + 'ani'}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        // exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, when: 'afterChildren', delay: 1.5 }}
      >
        <div className="container mx-auto">{children}</div>
        {!noFooter && <Footer />}
      </motion.div>
    </div>
  );
};

export default PageTransition;
