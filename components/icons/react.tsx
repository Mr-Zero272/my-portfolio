import { SVGProps } from 'react';

function React(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" {...props}>
            <path
                fill="currentColor"
                d="M418.2 177.2q-8.1-2.7-16.2-5.1c.9-3.7 1.7-7.4 2.5-11.1c12.3-59.6 4.2-107.5-23.1-123.3c-26.3-15.1-69.2.6-112.6 38.4c-4.3 3.7-8.5 7.6-12.5 11.5c-2.7-2.6-5.5-5.2-8.3-7.7c-45.5-40.4-91.1-57.4-118.4-41.5c-26.2 15.2-34 60.3-23 116.7c1.1 5.6 2.3 11.1 3.7 16.7c-6.4 1.8-12.7 3.8-18.6 5.9C38.3 196.2 0 225.4 0 255.6c0 31.2 40.8 62.5 96.3 81.5c4.5 1.5 9 3 13.6 4.3c-1.5 6-2.8 11.9-4 18c-10.5 55.5-2.3 99.5 23.9 114.6c27 15.6 72.4-.4 116.6-39.1c3.5-3.1 7-6.3 10.5-9.7c4.4 4.3 9 8.4 13.6 12.4c42.8 36.8 85.1 51.7 111.2 36.6c27-15.6 35.8-62.9 24.4-120.5q-1.35-6.6-3-13.5c3.2-.9 6.3-1.9 9.4-2.9c57.7-19.1 99.5-50 99.5-81.7c0-30.3-39.4-59.7-93.8-78.4M282.9 92.3c37.2-32.4 71.9-45.1 87.7-36c16.9 9.7 23.4 48.9 12.8 100.4c-.7 3.4-1.4 6.7-2.3 10c-22.2-5-44.7-8.6-67.3-10.6c-13-18.6-27.2-36.4-42.6-53.1c3.9-3.7 7.7-7.2 11.7-10.7M167.2 307.5c5.1 8.7 10.3 17.4 15.8 25.9c-15.6-1.7-31.1-4.2-46.4-7.5c4.4-14.4 9.9-29.3 16.3-44.5c4.6 8.8 9.3 17.5 14.3 26.1m-30.3-120.3c14.4-3.2 29.7-5.8 45.6-7.8c-5.3 8.3-10.5 16.8-15.4 25.4c-4.9 8.5-9.7 17.2-14.2 26c-6.3-14.9-11.6-29.5-16-43.6m27.4 68.9c6.6-13.8 13.8-27.3 21.4-40.6s15.8-26.2 24.4-38.9c15-1.1 30.3-1.7 45.9-1.7s31 .6 45.9 1.7q12.75 18.9 24.3 38.7c11.55 19.8 14.9 26.7 21.7 40.4q-10.05 20.7-21.6 40.8c-7.6 13.3-15.7 26.2-24.2 39c-14.9 1.1-30.4 1.6-46.1 1.6s-30.9-.5-45.6-1.4q-13.05-19.05-24.6-39c-11.55-19.95-14.8-26.8-21.5-40.6m180.6 51.2c5.1-8.8 9.9-17.7 14.6-26.7c6.4 14.5 12 29.2 16.9 44.3c-15.5 3.5-31.2 6.2-47 8c5.4-8.4 10.5-17 15.5-25.6m14.4-76.5c-4.7-8.8-9.5-17.6-14.5-26.2q-7.35-12.75-15.3-25.2c16.1 2 31.5 4.7 45.9 8c-4.6 14.8-10 29.2-16.1 43.4M256.2 118.3c10.5 11.4 20.4 23.4 29.6 35.8c-19.8-.9-39.7-.9-59.5 0c9.8-12.9 19.9-24.9 29.9-35.8M140.2 57c16.8-9.8 54.1 4.2 93.4 39c2.5 2.2 5 4.6 7.6 7c-15.5 16.7-29.8 34.5-42.9 53.1c-22.6 2-45 5.5-67.2 10.4c-1.3-5.1-2.4-10.3-3.5-15.5c-9.4-48.4-3.2-84.9 12.6-94m-24.5 263.6c-4.2-1.2-8.3-2.5-12.4-3.9c-21.3-6.7-45.5-17.3-63-31.2c-10.1-7-16.9-17.8-18.8-29.9c0-18.3 31.6-41.7 77.2-57.6c5.7-2 11.5-3.8 17.3-5.5c6.8 21.7 15 43 24.5 63.6c-9.6 20.9-17.9 42.5-24.8 64.5m116.6 98c-16.5 15.1-35.6 27.1-56.4 35.3c-11.1 5.3-23.9 5.8-35.3 1.3c-15.9-9.2-22.5-44.5-13.5-92c1.1-5.6 2.3-11.2 3.7-16.7c22.4 4.8 45 8.1 67.9 9.8c13.2 18.7 27.7 36.6 43.2 53.4c-3.2 3.1-6.4 6.1-9.6 8.9m24.5-24.3c-10.2-11-20.4-23.2-30.3-36.3c9.6.4 19.5.6 29.5.6c10.3 0 20.4-.2 30.4-.7c-9.2 12.7-19.1 24.8-29.6 36.4m130.7 30c-.9 12.2-6.9 23.6-16.5 31.3c-15.9 9.2-49.8-2.8-86.4-34.2c-4.2-3.6-8.4-7.5-12.7-11.5c15.3-16.9 29.4-34.8 42.2-53.6c22.9-1.9 45.7-5.4 68.2-10.5c1 4.1 1.9 8.2 2.7 12.2c4.9 21.6 5.7 44.1 2.5 66.3m18.2-107.5c-2.8.9-5.6 1.8-8.5 2.6c-7-21.8-15.6-43.1-25.5-63.8c9.6-20.4 17.7-41.4 24.5-62.9c5.2 1.5 10.2 3.1 15 4.7c46.6 16 79.3 39.8 79.3 58c0 19.6-34.9 44.9-84.8 61.4m-149.7-15c25.3 0 45.8-20.5 45.8-45.8s-20.5-45.8-45.8-45.8s-45.8 20.5-45.8 45.8s20.5 45.8 45.8 45.8"
            ></path>
        </svg>
    );
}

export default React;
