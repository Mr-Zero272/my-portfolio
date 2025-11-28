'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
  },
};

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.3 },
  },
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity },
  },
};

// Error State - Có lỗi
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  error?: string;
}

function ErrorState({
  title = 'Có lỗi xảy ra',
  description = 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
  onRetry,
  error,
}: ErrorStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 py-16"
      variants={containerVariants as never}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={iconVariants} initial="hidden" animate={['visible', 'animate']}>
        <div className="mb-4 rounded-full bg-red-50 p-6">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
      </motion.div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-4 max-w-sm text-center text-gray-600">{description}</p>
      {error && <p className="mb-6 max-w-sm rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {onRetry && (
        <Button onClick={onRetry} className="gap-2">
          <AlertCircle className="h-4 w-4" />
          Thử lại
        </Button>
      )}
    </motion.div>
  );
}

export default ErrorState;
