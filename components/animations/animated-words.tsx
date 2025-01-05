'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

type Props = {
    text: string;
    delay?: number;
    className?: string;
};

const AnimatedWords = ({ text, className = '', delay = 1.5 }: Props) => {
    const words = text.split(' ');
    const container = useMemo(() => {
        return {
            initial: {
                opacity: 1,
            },
            animate: {
                opacity: 1,
                transition: {
                    delay,
                    staggerChildren: 0.08,
                    when: 'beforeChildren',
                },
            },
        };
    }, [delay]);

    const wordItem = useMemo(() => {
        return {
            initial: {
                opacity: 0,
                y: 50,
            },
            animate: {
                opacity: 1,
                y: 0,
                transition: {
                    duratioin: 1,
                },
            },
        };
    }, []);
    return (
        <div className="mx-auto flex w-full items-center justify-center overflow-hidden py-1 text-center">
            <motion.h1
                variants={container}
                initial="initial"
                animate="animate"
                className={`inline-block w-full font-bold capitalize ${className}`}
            >
                {words.map((word, index) => (
                    <motion.span key={index + word} variants={wordItem} className="inline-block">
                        {word}&nbsp;
                    </motion.span>
                ))}
            </motion.h1>
        </div>
    );
};

export default AnimatedWords;
