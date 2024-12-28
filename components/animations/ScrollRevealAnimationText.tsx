'use client';

import { motion } from 'framer-motion';

type Props = {
    text: string | number;
    className?: string;
    delay?: number;
};

const ScrollRevealAnimationText = ({ text, className, delay = 1.6 }: Props) => {
    const letters = text.toString().split('');

    const container = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delay,
                when: 'beforeChildren',
            },
        },
    };

    const item = {
        hidden: { y: -50, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: 50, opacity: 0 },
    };

    return (
        <motion.div variants={container} initial="hidden" animate="visible" exit="hidden" className="flex">
            {letters.map((letter, index) => (
                <motion.span key={index} variants={item} className={`text-center ${className ? className : ''}`}>
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default ScrollRevealAnimationText;
