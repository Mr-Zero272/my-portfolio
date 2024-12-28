'use client'; // Enable client-side rendering for animations

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={(children as any)?.key}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
