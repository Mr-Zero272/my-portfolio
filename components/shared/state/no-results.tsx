'use client';

import { Button } from '@/components/ui/button';
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

// No Results - Không tìm thấy kết quả tìm kiếm
interface NoResultsProps {
  query?: string;
  onReset?: () => void;
  description?: string;
}

function NoResults({ query = '', onReset, description = 'No matching results found' }: NoResultsProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 py-16"
      variants={containerVariants as never}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={iconVariants} initial="hidden" animate={['visible', 'animate']}>
        <div className="mb-4 rounded-full bg-blue-50 p-6">
          <Search className="h-10 w-10 text-blue-400" />
        </div>
      </motion.div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">No results found</h3>
      <p className="mb-6 max-w-sm text-center text-gray-600">
        {query && `There were no results matching "${query}". `}
        {description}
      </p>
      {onReset && (
        <Button variant="outline" onClick={onReset} className="gap-2">
          <Search className="h-4 w-4" />
          Reset Search
        </Button>
      )}
    </motion.div>
  );
}

export default NoResults;
