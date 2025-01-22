'use client';
import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    label: string;
    value: string;
    onCheck?: (value: string) => void;
    active?: boolean;
};

const CustomCheckbox = ({ label, value, active = false, onCheck = () => {} }: Props) => {
    const [hovered, setHovered] = useState(false);
    const variants = useMemo(
        () => ({
            initial: { opacity: 0, y: 15 },
            show: { opacity: 100, y: 0, transition: { delay: 0.1, duration: 0.4 } },
            hidden: { opacity: 0, y: -15, transition: { duration: 0.3 } },
        }),
        [],
    );
    return (
        <div
            className={cn(
                'flex w-fit cursor-pointer items-center justify-between rounded-md border border-transparent px-5 py-3 shadow-md hover:border-slate-100 md:w-full',
                {
                    'bg-black text-white shadow-none': active,
                },
            )}
            onClick={() => onCheck(value)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <p>{label}</p>
            <AnimatePresence mode="wait">
                {hovered && (
                    <motion.span
                        className="hidden md:inline-block"
                        variants={variants}
                        key={'hovered'}
                        initial={'initial'}
                        animate={'show'}
                        exit={'hidden'}
                    >
                        <ArrowUp className="size-5" />
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomCheckbox;
