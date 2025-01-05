'use client';
import React from 'react';
import { motion, useInView } from 'framer-motion';

type Props = {
    text: string;
    className?: string;
    animateOptions?: KeyframeEffectOptions;
};

const AnimatedTyping = ({ text, className = '', animateOptions }: Props) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    return (
        <p ref={ref} className={`tracking-tighter ${className}`}>
            {text.split('').map((letter, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.2, delay: index * 0.1, ...animateOptions }}
                >
                    {letter}
                </motion.span>
            ))}
        </p>
    );
};

export default AnimatedTyping;
