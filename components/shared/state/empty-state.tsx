'use client';

import { Search } from 'lucide-react';
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

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

// Empty State - Không có dữ liệu
function EmptyState({
  title = 'No data available',
  description = 'There is currently no data to display.',
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 py-16"
      variants={containerVariants as never}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={iconVariants} initial="hidden" animate={['visible', 'animate']}>
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
      </motion.div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-6 max-w-sm text-center text-gray-600">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}

export default EmptyState;
