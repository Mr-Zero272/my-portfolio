'use client';

import { commentsApi } from '@/apis/comments';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import { ICommentResponse } from '@/models/Comment';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Copy, Flag, Loader2, MessageCircle, MoreHorizontal, Pencil, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'nextjs-toploader/app';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import CommentBox from './comment-box';
import CommentReply from './comment-reply';

type CommentProps = {
  comment: ICommentResponse;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  className?: string;
};

const Comment = ({ comment, onLike, onDislike, className }: CommentProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showEditBox, setShowEditBox] = useState(false);
  const [showDialogDeleteConfirm, setShowDialogDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: commentsApi.deleteComment,
  });

  const { mutateAsync: updateComment, isPending: isUpdatingComment } = useMutation({
    mutationFn: commentsApi.updateComment,
  });

  const { mutateAsync: createComment, isPending: isCreatingComment } = useMutation({
    mutationFn: commentsApi.crateComment,
  });

  // Tính toán totalPages dựa trên replyCount (giả sử limit=3)
  const totalPages = Math.ceil(Number(comment?.replyCount || 0) / 3);
  const hasMoreThanOnePage = Number(comment?.replyCount || 0) > 3;

  logger({
    totalPages,
    hasMoreThanOnePage,
  });

  // Cấu hình initialData cho page 1 từ comment.replies
  const initialData = {
    pages: [
      {
        data: comment?.replies || [], // Dữ liệu page 1 từ props
        pagination: {
          page: 1,
          totalPages,
          // Có thể thêm các field khác từ API nếu cần, ví dụ: totalItems: comment.replyCount
        },
      },
    ],
    pageParams: [1], // PageParam ban đầu là 1
  };

  const {
    data: repliesRes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingReplies,
  } = useInfiniteQuery({
    initialPageParam: hasMoreThanOnePage ? 2 : undefined,
    queryKey: ['comments-by-parent', { commentId: comment._id.toString() }],
    queryFn: ({ pageParam = 1 }) =>
      commentsApi.getCommentByParentId({ page: pageParam, limit: 3, parentId: comment._id.toString() }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialData: hasMoreThanOnePage ? initialData : undefined,
    enabled: !!comment && comment.replyCount ? Number(comment.replyCount) > 3 : false,
  });

  const replies = useMemo(() => {
    return repliesRes?.pages.flatMap((page) => page.data) || comment.replies || [];
  }, [repliesRes, comment.replies]);

  const handleReply = async (content: string, images?: string[]) => {
    try {
      if (!comment) return;

      await createComment({
        data: {
          postId: comment.postId,
          content,
          images,
          author: session?.user?.id,
          parentId: comment._id.toString(),
        },
      });
      // Invalidate comments query to refetch comments
      if (typeof comment.replyCount === 'number' && comment.replyCount <= 3) {
        await queryClient.invalidateQueries({
          queryKey: ['comments-by-post', { postId: comment.postId }],
        });
      } else if (typeof comment.replyCount === 'number' && comment.replyCount > 3) {
        await queryClient.invalidateQueries({
          queryKey: ['comments-by-parent', { commentId: comment._id.toString() }],
        });
      }
      setShowReplyBox((prev) => !prev);
      toast.success('Your reply has been added successfully.');
    } catch (error) {
      console.error('Failed to create reply comment:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ commentId, userId: session?.user?.id || '' });
      // Invalidate comments query to refetch comments
      await queryClient.invalidateQueries({
        queryKey: ['comments-by-post', { postId: comment.postId }],
      });
      toast.success('Bình luận đã được xóa!');
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi xóa bình luận.');
      console.error('Failed to delete comment:', error);
    }
  };

  const handleUpdateComment = async (content: string, images?: string[]) => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
    }

    try {
      await updateComment({
        commentId: comment._id.toString(),
        data: {
          content,
          images,
        },
      });
      // Invalidate comments query to refetch comments
      await queryClient.invalidateQueries({
        queryKey: ['comments-by-post', { postId: comment.postId }],
      });
      setShowEditBox(false);
      toast.success('Your comment has been updated successfully.');
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Failed to create comment:', error);
    }
  };

  const isLiked = useMemo(
    () => comment.likes?.some((id) => id.toString() === session?.user?.id),
    [comment.likes, session?.user?.id],
  );
  const isDisliked = useMemo(
    () => comment.dislikes?.some((id) => id.toString() === session?.user?.id),
    [comment.dislikes, session?.user?.id],
  );
  const likesCount = useMemo(() => comment.likes?.length || 0, [comment.likes]);
  const dislikesCount = useMemo(() => comment.dislikes?.length || 0, [comment.dislikes]);
  const repliesCount = useMemo(() => comment.replyCount || 0, [comment.replyCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn('group/comment', className)}
    >
      <div className="hover:bg-muted/50 flex gap-3 rounded-lg p-4 transition-colors">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {comment?.author?.username?.charAt?.(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-foreground text-sm font-medium">{comment.author.username}</span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: enUS,
              })}
            </span>
            {comment.author.role === 'admin' && (
              <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                Admin
              </Badge>
            )}
          </div>

          {/* Comment Content */}
          {showEditBox ? (
            <CommentBox
              mode="edit"
              initialContent={comment.content}
              initialImages={comment.images}
              onSubmit={handleUpdateComment}
              isSubmitting={isUpdatingComment}
              onCancel={() => setShowEditBox(false)}
              showCancel={true}
            />
          ) : (
            <>
              <div className="text-foreground mb-3 text-sm leading-relaxed">{comment.content}</div>
              {/* Images if any */}
              {comment.images && comment.images.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {comment.images.map((image, index) => (
                    <motion.img
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      src={image}
                      alt={`Comment image ${index + 1}`}
                      className="max-h-32 max-w-xs rounded-lg border object-cover"
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Actions */}
          {!showEditBox && (
            <div className="flex items-center gap-1 text-xs">
              {/* Like */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike?.(comment._id.toString())}
                className={cn(
                  'h-8 gap-1 px-2 transition-colors hover:bg-blue-50 hover:text-blue-600',
                  isLiked && 'bg-blue-50 text-blue-600',
                )}
              >
                <ThumbsUp className={cn('h-3 w-3', isLiked && 'fill-current')} />
                {likesCount > 0 && <span>{likesCount}</span>}
              </Button>

              {/* Dislike */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDislike?.(comment._id.toString())}
                className={cn(
                  'h-8 gap-1 px-2 transition-colors hover:bg-red-50 hover:text-red-600',
                  isDisliked && 'bg-red-50 text-red-600',
                )}
              >
                <ThumbsDown className={cn('h-3 w-3', isDisliked && 'fill-current')} />
                {dislikesCount > 0 && <span>{dislikesCount}</span>}
              </Button>

              {/* Reply */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyBox((prev) => !prev)}
                className="h-8 gap-1 px-2 transition-colors hover:bg-green-50 hover:text-green-600"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Reply</span>
              </Button>

              {/* Show Replies */}
              {repliesCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleReplies}
                  className="text-muted-foreground hover:text-foreground h-8 gap-1 px-2 transition-colors"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>{repliesCount} relies</span>
                </Button>
              )}

              {/* More actions */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-8 w-8 p-0 opacity-0 transition-opacity group-hover/comment:opacity-100"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  {session?.user?.id === comment.author._id.toString() && (
                    <DropdownMenuItem onSelect={() => setShowEditBox(true)}>
                      <Pencil className="text-muted-foreground mr-2 h-3.5 w-3.5" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={() => {}}>
                    <Flag /> Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy /> Copy content
                  </DropdownMenuItem>
                  {session?.user?.id === comment.author._id.toString() && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => setShowDialogDeleteConfirm(true)}
                        className="text-destructive hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="text-destructive" /> Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Reply box */}
          {showReplyBox && (
            <CommentBox
              onSubmit={handleReply}
              isSubmitting={isCreatingComment}
              showCancel
              onCancel={() => setShowReplyBox(false)}
            />
          )}

          {/* Replies */}
          <AnimatePresence mode="wait">
            {showReplies && comment.replies && comment.replies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="border-muted mt-4 space-y-3 border-l-2 pl-4"
              >
                {replies.map((reply, index) => (
                  <CommentReply
                    key={reply._id.toString()}
                    reply={reply}
                    index={index}
                    onLike={onLike}
                    onDislike={onDislike}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load more replies */}
          {showReplies && hasNextPage && (
            <div className="mt-2">
              <AnimatedButton
                variant="link"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-muted-foreground hover:text-foreground"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Xem thêm {repliesCount} phản hồi
              </AnimatedButton>
            </div>
          )}
        </div>

        {/* Delete dialog confirm */}
        <ConfirmDialog
          open={showDialogDeleteConfirm}
          onOpenChange={setShowDialogDeleteConfirm}
          title="Delete this comment?"
          description="Are you sure you want to delete this comment? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isHandling={isDeletingComment}
          onConfirm={async () => {
            await handleDeleteComment(comment._id.toString());
          }}
        />
      </div>
    </motion.div>
  );
};

export default Comment;

export const CommentSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn('group/comment', className)}
    >
      <div className="hover:bg-muted/50 flex gap-3 rounded-lg p-4 transition-colors">
        {/* Avatar Skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header Skeleton */}
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-10 rounded" />
          </div>

          {/* Comment Content Skeleton */}
          <div className="mb-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Images Skeleton */}
          <div className="mb-3 flex flex-wrap gap-2">
            <Skeleton className="h-32 w-xs rounded-lg" />
          </div>

          {/* Actions Skeleton */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-12 rounded" />
            <Skeleton className="h-8 w-12 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
            <Skeleton className="ml-auto h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
