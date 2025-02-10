import { Youtube } from '@/components/icons';
import Link from 'next/link';

function Footer() {
    return (
        <footer className="body-font text-gray-600">
            <div className="container mx-auto flex flex-col items-center px-5 py-8 sm:flex-row">
                <a className="title-font flex items-center justify-center font-medium text-gray-900 md:justify-start">
                    <span className="ml-3 text-xl font-bold dark:text-white">
                        Piti<span className="text-primary">.</span>
                    </span>
                </a>
                <p className="mt-4 text-sm text-gray-500 sm:ml-4 sm:mt-0 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:pl-4">
                    © 2025 My Portfolio —
                    <Link
                        href="https://github.com/Mr-Zero272"
                        className="ml-1 text-gray-600"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        @Mr-Zero272
                    </Link>
                </p>
                <span className="mt-4 inline-flex justify-center sm:ml-auto sm:mt-0 sm:justify-start">
                    <Link href="https://facebook.com/thuong.piti.5" className="text-gray-500">
                        <svg
                            fill="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            className="h-5 w-5 hover:text-blue-600"
                            viewBox="0 0 24 24"
                        >
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                    </Link>
                    <Link href="www.twitter.com" className="ml-3 text-gray-500">
                        <svg
                            fill="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            className="h-5 w-5 hover:text-blue-500"
                            viewBox="0 0 24 24"
                        >
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                    </Link>
                    <Link href="https://youtube.com/@MoonCoder-o3v" className="ml-3 text-gray-500">
                        <Youtube className="size-5 hover:text-red-500" />
                    </Link>
                    <Link href="https://linkedin.com/in/mr-zero272" className="ml-3 text-gray-500">
                        <svg
                            fill="currentColor"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={0}
                            className="h-5 w-5 hover:text-blue-600"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="none"
                                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                            />
                            <circle cx={4} cy={4} r={2} stroke="none" />
                        </svg>
                    </Link>
                </span>
            </div>
        </footer>
    );
}

export default Footer;
