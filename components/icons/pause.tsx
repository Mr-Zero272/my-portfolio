import React from 'react';
import type { SVGProps } from 'react';

export function Pause(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
            <g
                fill="none"
                stroke="currentColor"
                strokeDasharray={32}
                strokeDashoffset={32}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
            >
                <path d="M7 6h2v12h-2Z">
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="32;0"></animate>
                </path>
                <path d="M15 6h2v12h-2Z">
                    <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        begin="0.4s"
                        dur="0.4s"
                        values="32;0"
                    ></animate>
                </path>
            </g>
        </svg>
    );
}

export default Pause;
