'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    setErrorMessage(error.message || 'Something went wrong');
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 text-center">
      <motion.div
        className="max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50"
        >
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </motion.div>

        <motion.h1
          className="mt-6 text-2xl font-bold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Oops! Something went wrong
        </motion.h1>

        <motion.p
          className="mt-3 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {errorMessage}
        </motion.p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <motion.button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 rounded-md bg-red-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </motion.button>

          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="h-4 w-4" />
            Go Home
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        If this problem persists, please contact our support team.
      </motion.div>
    </div>
  );
};

export default Error;
