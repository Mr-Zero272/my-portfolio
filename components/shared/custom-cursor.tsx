'use client';
import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorOutlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const moveCursorEvent = (e: MouseEvent) => {
            const posX = e.clientX;
            const posY = e.clientY;

            if (cursorDotRef.current && cursorOutlineRef.current) {
                cursorDotRef.current.style.left = `${posX}px`;
                cursorDotRef.current.style.top = `${posY}px`;
                cursorOutlineRef.current.animate(
                    {
                        left: `${posX}px`,
                        top: `${posY}px`,
                    },
                    { duration: 500, fill: 'forwards' },
                );
            }
        };

        // const mouseDownEventHandler = () => {
        //     if (cursorDotRef.current && cursorOutlineRef.current) {
        //         cursorDotRef.current.style.height = '30px';
        //         cursorDotRef.current.style.width = '30px';
        //     }
        // };

        // const mouseUpEventHandler = () => {
        //     if (cursorDotRef.current && cursorOutlineRef.current) {
        //         cursorDotRef.current.style.height = '5px';
        //         cursorDotRef.current.style.width = '5px';
        //     }
        // };

        window.addEventListener('mousemove', moveCursorEvent);
        // window.addEventListener('mousedown', mouseDownEventHandler);
        // window.addEventListener('mouseup', mouseUpEventHandler);

        return () => {
            window.removeEventListener('mousemove', moveCursorEvent);
            // window.removeEventListener('click', mouseDownEventHandler);
            // window.removeEventListener('mouseup', mouseUpEventHandler);
        };
    }, []);
    return (
        <div className="z-[9999] h-full w-full">
            <div
                ref={cursorDotRef}
                className="z-1 cursor-custom pointer-events-none fixed left-1/2 top-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black transition-all duration-300 ease-linear"
            ></div>
            <div
                ref={cursorOutlineRef}
                className="z-1 pointer-events-none fixed left-1/2 top-1/2 size-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black"
            ></div>
        </div>
    );
};

export default CustomCursor;
