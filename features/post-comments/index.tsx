'use client';

import { commentsApi } from '@/apis/comments';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { CommentList } from './components';
import { useCommentStore } from './store/use-comment-store';

interface PostCommentFeatureProps {
  postId: string;
  className?: string;
}

const PostCommentFeature = ({ postId, className }: PostCommentFeatureProps) => {
  const { data: session } = useSession();
  const { replyToUsername } = useCommentStore();
  const {
    data: commentsRes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPostComments,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['comments-by-post', { postId }],
    queryFn: ({ pageParam = 1 }) => commentsApi.getCommentsByPostId({ page: pageParam, limit: 8, postId }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });

  const { mutateAsync: createComment, isPending: isCreatingComment } = useMutation({
    mutationFn: commentsApi.crateComment,
  });

  const { mutateAsync: replyComment, isPending: isReplying } = useMutation({
    mutationFn: commentsApi.crateComment,
  });

  const comments = useMemo(() => {
    return commentsRes?.pages.flatMap((page) => page.data) || [];
  }, [commentsRes]);

  const totalComments = useMemo(() => {
    return commentsRes?.pages[0]?.pagination.total || 0;
  }, [commentsRes]);

  const handleAddComment = async () => {
    // Gọi API tạo comment mới
  };

  const handleReplySubmit = async () => {
    // Gọi API tạo phản hồi cho comment
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('relative space-y-6', className)}
    >
      {/* Header */}
      <div className="bg-background sticky top-0 z-10 flex items-center justify-between pb-2 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h3 className="text-foreground text-lg font-semibold">Comments</h3>
          <Badge>{totalComments || 0}</Badge>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <AnimatedButton variant="ghost" aria-label="Open menu">
              <ArrowUpDown size={16} />
              Most Recent
              <ChevronDown />
            </AnimatedButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuItem onSelect={() => {}}>Most likes</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>Most recent</DropdownMenuItem>
            <DropdownMenuItem disabled>Download</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* <Separator /> */}

      {/* Comment Input */}
      {/* {session && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CommentBox
            onSubmit={handleAddComment}
            isSubmitting={isCreatingComment}
            placeholder="Viết bình luận của bạn..."
          />
        </motion.div>
      )} */}

      {/* Reply Box */}
      {/* {replyToUsername && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-muted/50 ml-12 rounded-lg border border-dashed p-4"
        >
          <div className="text-muted-foreground mb-3 text-sm">Đang trả lời bình luận...</div>
          <CommentBox
            onSubmit={handleReplySubmit}
            onCancel={() => {}}
            isSubmitting={isReplying}
            placeholder="Viết phản hồi của bạn..."
            showCancel
          />
        </motion.div>
      )} */}

      {/* Comments List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <CommentList comments={comments as never} isLoading={isLoadingPostComments} />
      </motion.div>
    </motion.section>
  );
};

export default PostCommentFeature;
