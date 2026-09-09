import Link from 'next/link';

export const RootFooter = () => {
  return (
    <footer className="body-font text-gray-600">
      <div className="flex flex-col items-center px-5 py-8 sm:flex-row md:py-2">
        <Link
          href="/"
          className="title-font flex items-center justify-center font-medium text-gray-900 md:justify-start"
        >
          <span className="ml-3 text-xl font-bold dark:text-white">
            Piti<span className="text-primary">.</span>
          </span>
        </Link>
        <p className="mt-4 text-sm text-gray-500 sm:mt-0 sm:ml-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:pl-4">
          © 2026 My Portfolio —
          <Link
            href="https://github.com/Mr-Zero272"
            className="ml-1 text-gray-600"
            rel="noopener noreferrer"
            target="_blank"
          >
            @Mr-Zero272
          </Link>
        </p>
        <span className="mt-4 inline-flex justify-center sm:mt-0 sm:ml-auto sm:justify-start">
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
          {/* <Link href="https://www.youtube.com/@Zeroo-ge" className="ml-3 text-gray-500">
            <Youtube className="size-5 hover:text-red-500" />
          </Link> */}
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
};
