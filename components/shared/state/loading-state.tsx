'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
  },
};

// Loading State - Đang tải
interface LoadingStateProps {
  message?: string;
}

function LoadingState({ message = 'Đang tải dữ liệu...' }: LoadingStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 py-16"
      variants={containerVariants as never}
      initial="hidden"
      animate="visible"
    >
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
        <div className="mb-4 rounded-full bg-blue-50 p-6">
          <Loader2 className="h-10 w-10 text-blue-500" />
        </div>
      </motion.div>
      <p className="text-center text-gray-600">{message}</p>
    </motion.div>
  );
}

export default LoadingState;
