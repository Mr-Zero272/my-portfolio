'use client';

import { cn } from '@/lib/utils';
import { ICommentResponse } from '@/models/Comment';
import { AnimatePresence, motion } from 'framer-motion';
import Comment from './comment';

type CommentListProps = {
  comments: ICommentResponse[];
  isLoading?: boolean;
  className?: string;
};

const CommentList = ({ comments, isLoading, className }: CommentListProps) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(3)].map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!comments.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('py-12 text-center', className)}
      >
        <div className="text-muted-foreground text-sm">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</div>
      </motion.div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <AnimatePresence mode="popLayout">
        {comments.map((comment) => (
          <Comment key={comment._id.toString()} comment={comment} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Skeleton component for loading state
const CommentSkeleton = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 p-4">
      {/* Avatar skeleton */}
      <div className="flex-shrink-0">
        <div className="bg-muted h-10 w-10 animate-pulse rounded-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 space-y-2">
        {/* Header skeleton */}
        <div className="flex items-center gap-2">
          <div className="bg-muted h-4 w-20 animate-pulse rounded" />
          <div className="bg-muted h-3 w-16 animate-pulse rounded" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-1">
          <div className="bg-muted h-4 w-full animate-pulse rounded" />
          <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
        </div>

        {/* Actions skeleton */}
        <div className="flex items-center gap-2 pt-2">
          <div className="bg-muted h-6 w-12 animate-pulse rounded" />
          <div className="bg-muted h-6 w-12 animate-pulse rounded" />
          <div className="bg-muted h-6 w-16 animate-pulse rounded" />
        </div>
      </div>
    </motion.div>
  );
};

export default CommentList;
