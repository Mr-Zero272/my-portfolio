'use client';

import { Home, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    setErrorMessage(error.message || 'Something went wrong');
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Animated 500 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.h1
            className="bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-9xl font-bold text-transparent md:text-[12rem]"
            animate={{
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            500
          </motion.h1>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-red-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 space-y-4"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">Lỗi máy chủ</h2>
          <p className="mx-auto max-w-md text-lg text-gray-300">
            Đã xảy ra lỗi không mong muốn từ phía máy chủ. Chúng tôi đang khắc phục sự cố này. Vui lòng thử lại sau.
          </p>
          {errorMessage && <p className="text-sm text-red-400">Chi tiết lỗi: {errorMessage}</p>}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition-shadow hover:shadow-red-500/50"
          >
            <RefreshCw size={20} />
            Tải lại trang
          </motion.button>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Home size={20} />
              Về trang chủ
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative element */}
        <motion.div
          className="mt-16 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-red-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Error;
