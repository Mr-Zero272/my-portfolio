import { SVGProps } from 'react';

function Tailwindcss(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M7 9.969q1-4.063 5-4.063c4 0 4.5 3.047 6.5 3.555q2 .508 3.5-1.524Q21 12 17 12c-4 0-4.5-3.047-6.5-3.555Q8.5 7.938 7 9.97m-5 6.094Q3 12 7 12c4 0 4.5 3.047 6.5 3.555q2 .507 3.5-1.524q-1 4.063-5 4.063c-4 0-4.5-3.047-6.5-3.555q-2-.508-3.5 1.524"
                clipRule="evenodd"
            ></path>
        </svg>
    );
}

export default Tailwindcss;
