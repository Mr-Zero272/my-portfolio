import { SVGProps } from 'react';

export function Typescript(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                <rect width="16.5" height="16.5" x="3.75" y="3.75" rx="2"></rect>
                <path d="M17.25 11.25h-2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2m-4.75-6v6m-2-6h4"></path>
            </g>
        </svg>
    );
}

export default Typescript;
