import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Loader2, Search } from 'lucide-react';

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
export function EmptyState({
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

// No Results - Không tìm thấy kết quả tìm kiếm
interface NoResultsProps {
  query?: string;
  onReset?: () => void;
  description?: string;
}

export function NoResults({ query = '', onReset, description = 'No matching results found' }: NoResultsProps) {
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

// Error State - Có lỗi
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  error?: string;
}

export function ErrorState({
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

// Loading State - Đang tải
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Đang tải dữ liệu...' }: LoadingStateProps) {
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

// Unauthorized - Không có quyền truy cập
interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  onLogin?: () => void;
}

export function UnauthorizedState({
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
