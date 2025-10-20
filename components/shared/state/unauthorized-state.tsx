'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

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

// Unauthorized - Không có quyền truy cập
interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  onLogin?: () => void;
}

function UnauthorizedState({
  title = 'Không có quyền truy cập',
  description = 'Bạn cần đăng nhập để xem nội dung này',
  onLogin,
}: UnauthorizedStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 py-16"
      variants={containerVariants as never}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={iconVariants} initial="hidden" animate={['visible', 'animate']}>
        <div className="mb-4 rounded-full bg-yellow-50 p-6">
          <AlertCircle className="h-10 w-10 text-yellow-500" />
        </div>
      </motion.div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-6 max-w-sm text-center text-gray-600">{description}</p>
      {onLogin && (
        <Button onClick={onLogin} className="gap-2">
          Đăng nhập
        </Button>
      )}
    </motion.div>
  );
}

export default UnauthorizedState;
