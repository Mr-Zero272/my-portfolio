'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Footer from '../layouts/components/footer';
import PageTransitionAnimation from './page-transition-animation';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    return (
        <div className="w-full overflow-y-auto bg-background pt-16">
            <PageTransitionAnimation />
            <motion.div
                key={pathname + 'ani'}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                // exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, when: 'afterChildren', delay: 1.5 }}
            >
                <div className="container mx-auto">{children}</div>
                <Footer />
            </motion.div>
        </div>
    );
};

export default PageTransition;
