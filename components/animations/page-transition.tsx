'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Footer from '../layouts/components/footer';
import PageTransitionAnimation from './page-transition-animation';

const PageTransition = ({ children, noFooter = false }: { children: React.ReactNode; noFooter?: boolean }) => {
  const pathname = usePathname();
  return (
    <div className="bg-background w-full overflow-y-auto">
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
