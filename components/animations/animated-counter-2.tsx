'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type DigitScrollerType = {
    digit: number;
    animateOptions?: KeyframeEffectOptions;
};

export const DigitScroller = ({ digit, animateOptions }: DigitScrollerType) => {
    const digits = Array.from({ length: 10 }, (_, i) => i);

    return (
        <div className="relative flex h-12 w-8 items-center justify-center overflow-hidden">
            <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: `${-digit * 100}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, ...animateOptions }}
                className="flex flex-col"
            >
                {digits.map((num) => (
                    <div key={num} className="flex h-12 w-full items-center justify-center text-2xl font-bold">
                        {num}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const AnimatedCounter2 = ({ targetNumber }: { targetNumber: string }) => {
    const [digits, setDigits] = useState<number[]>([]);

    useEffect(() => {
        const numberDigits = String(targetNumber).split('').map(Number);
        setDigits(numberDigits);
        console.log(numberDigits);
    }, [targetNumber]);

    return (
        <div className="flex space-x-2">
            {digits.map((digit, index) => (
                <DigitScroller key={index} digit={digit} animateOptions={{ delay: index * 0.2 }} />
            ))}
        </div>
    );
};

export default AnimatedCounter2;
