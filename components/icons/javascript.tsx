import { SVGProps } from 'react';

export function Javascript(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                <rect width="16.5" height="16.5" x="3.75" y="3.75" rx="2"></rect>
                <path d="M11.5 11.25v5a1 1 0 0 1-1 1H9m8.25-6h-2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2"></path>
            </g>
        </svg>
    );
}

export default Javascript;
