'use client';
import React, { useRef, useState, useEffect } from 'react';

interface MarqueeTextProps {
    text: string;
    duration?: number;
    className?: string;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ text, duration, className = '' }) => {
    const textRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [totalScroll, setTotalScroll] = useState(0);

    useEffect(() => {
        if (textRef.current && containerRef.current) {
            const textWidth = textRef.current.scrollWidth;
            const containerWidth = containerRef.current.offsetWidth;
            setTotalScroll(textWidth - containerWidth);
        }
    }, [text]);

    const handleMouseEnter = () => {
        if (totalScroll > 0) {
            setScrollPosition(totalScroll);
            setTimeout(
                () => {
                    setScrollPosition(0);
                },
                duration ? duration * 1000 + 3000 : 2000,
            );
        }
    };

    return (
        <div ref={containerRef} className="overflow-hidden whitespace-nowrap" onMouseEnter={handleMouseEnter}>
            <div
                ref={textRef}
                className={`inline-block transition-transform ease-linear ${className}`}
                style={{
                    transform: totalScroll > 0 ? `translateX(-${scrollPosition}px)` : 'translateX(0)',
                    animationDuration: duration ? duration + 's' : '1s',
                    transitionDuration: duration ? duration + 's' : '1s',
                }}
            >
                {text}
            </div>
        </div>
    );
};

export default MarqueeText;
