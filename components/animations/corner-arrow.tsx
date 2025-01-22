'use client';
import { motion, useAnimationControls } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const CornerArrows = () => {
    const [hovered, setHovered] = useState(false);

    const firstArrowControl = useAnimationControls();
    const secondArrowControl = useAnimationControls();

    useEffect(() => {
        if (hovered) {
            firstArrowControl.start('move');
            secondArrowControl.start('move');
        } else {
            firstArrowControl.start('normal');
            secondArrowControl.start('normal');
        }
    }, [hovered, firstArrowControl, secondArrowControl]);

    return (
        <div className="relative size-6" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <motion.div
                className="absolute top-0 text-gray-600"
                animate={firstArrowControl}
                variants={{
                    normal: {
                        x: 0,
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.5,
                        },
                    },
                    move: {
                        x: 10,
                        y: -10,
                        opacity: 0,
                        transition: {
                            duration: 0.5,
                        },
                    },
                }}
            >
                <ArrowUpRight className="size-6" />
            </motion.div>

            <motion.div
                className="absolute top-0 text-gray-600"
                animate={secondArrowControl}
                variants={{
                    normal: {
                        x: -10,
                        y: 10,
                        opacity: 0,
                        transition: {
                            duration: 0.5,
                        },
                    },
                    move: {
                        x: 0,
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.5,
                        },
                    },
                }}
            >
                <ArrowUpRight className="size-6" />
            </motion.div>
        </div>
    );
};

export default CornerArrows;
