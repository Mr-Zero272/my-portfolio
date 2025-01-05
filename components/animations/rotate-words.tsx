'use client';
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type RotateWordsProps = {
    text: string;
    words: string[];
    position?: 'ahead' | 'behind';
    className?: string;
};

export function RotateWords({ text, words, className = '', position = 'ahead' }: RotateWordsProps) {
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 5000);
        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, [words]);
    return (
        <div className={cn('flex w-fit items-center gap-1.5 tracking-tighter', className)}>
            {position === 'ahead' && <span>{text} </span>}
            <AnimatePresence mode="wait">
                <motion.p
                    key={words[index]}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                >
                    {words[index]}
                </motion.p>
            </AnimatePresence>
            {position === 'behind' && <span> {text}</span>}
        </div>
    );
}
