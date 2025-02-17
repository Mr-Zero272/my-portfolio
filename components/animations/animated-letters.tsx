'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

type Props = {
    text: string | number;
    className?: string;
    delay?: number;
};

const AnimatedLetters = ({ text, className, delay = 1.5 }: Props) => {
    const letters = text.toString().split('');

    const container = useMemo(() => {
        return {
            hidden: { opacity: 1 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.2,
                    delay,
                    when: 'beforeChildren',
                },
            },
            exit: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.2,
                    staggerDirection: -1,
                    when: 'afterChildren',
                },
            },
        };
    }, [delay]);

    const item = useMemo(() => {
        return {
            hidden: { y: -30, opacity: 0 },
            visible: { y: 0, opacity: 1 },
            exit: { y: -30, opacity: 0 },
        };
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.div key={text} variants={container} initial="hidden" animate="visible" exit="exit" className="flex">
                {letters.map((letter, index) => (
                    <motion.span
                        key={index}
                        variants={item}
                        className={`whitespace-pre-wrap text-center ${className ? className : ''}`}
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.div>
        </AnimatePresence>
    );
};

export default AnimatedLetters;
