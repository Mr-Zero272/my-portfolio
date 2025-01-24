'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import PageTransitionAnimation from './page-transition-animation';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    return (
        <div className="w-full">
            <PageTransitionAnimation />
            <motion.div
                key={pathname + 'ani'}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                // exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, when: 'afterChildren', delay: 1.5 }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default PageTransition;
