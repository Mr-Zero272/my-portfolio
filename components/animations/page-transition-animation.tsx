'use client';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const PageTransitionAnimation = () => {
    const pathname = usePathname();
    return (
        <AnimatePresence mode="wait">
            <div key={pathname + 'pai'}>
                <motion.div
                    className="fixed bottom-0 right-full top-0 z-30 h-screen w-screen bg-primary"
                    initial={{ x: '100%', width: '100%' }}
                    animate={{ x: '0%', width: '0%' }}
                    exit={{ x: ['0%', '100%'], width: ['0%', '100%'] }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
                <motion.div
                    className="fixed bottom-0 right-full top-0 z-20 h-screen w-screen bg-white"
                    initial={{ x: '100%', width: '100%' }}
                    animate={{ x: '0%', width: '0%' }}
                    transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
                />
                <motion.div
                    className="fixed bottom-0 right-full top-0 z-10 h-screen w-screen bg-black"
                    initial={{ x: '100%', width: '100%' }}
                    animate={{ x: '0%', width: '0%' }}
                    transition={{ delay: 0.4, duration: 0.8, ease: 'easeInOut' }}
                />
            </div>
        </AnimatePresence>
    );
};

export default PageTransitionAnimation;
