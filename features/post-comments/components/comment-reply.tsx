'use client';

import { commentsApi } from '@/apis/comments';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ICommentResponse } from '@/models/Comment';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Copy, Flag, MessageCircle, MoreHorizontal, Pencil, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'nextjs-toploader/app';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDetailCommentStore } from '../store/use-detail-comment';
import CommentBox from './comment-box';

type CommentReplyProps = {
  reply: ICommentResponse;
  index: number;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  className?: string;
};

const CommentReply = ({ reply, index, onLike, onDislike, className }: CommentReplyProps) => {
  const { setField } = useDetailCommentStore();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
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

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ commentId, userId: session?.user?.id || '' });
      // Invalidate comments query to refetch comments
      if (index <= 2) {
        await queryClient.invalidateQueries({
          queryKey: ['comments-by-post', { postId: reply.postId }],
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['comments-by-parent', { commentId: reply.parentId }],
        });
      }

      toast.success('Phản hồi đã được xóa!');
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi xóa phản hồi.');
      console.error('Failed to delete reply:', error);
    }
  };

  const handleUpdateComment = async (content: string, images?: string[]) => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    try {
      await updateComment({
        commentId: reply._id.toString(),
        data: {
          content,
          images,
        },
      });
      // Invalidate comments query to refetch comments
      if (index <= 2) {
        await queryClient.invalidateQueries({
          queryKey: ['comments-by-post', { postId: reply.postId }],
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['comments-by-parent', { commentId: reply.parentId }],
        });
      }
      setShowEditBox(false);
      toast.success('Phản hồi đã được cập nhật!');
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi cập nhật phản hồi.');
      console.error('Failed to update reply:', error);
    }
  };

  const handleReply = async (content: string, images?: string[]) => {
    try {
      if (!reply) return;

      await createComment({
        data: {
          postId: reply.postId,
          content,
          images,
          author: session?.user?.id,
          parentId: reply._id.toString(),
        },
      });
      // Invalidate comments query to refetch comments
      if (index <= 2) {
        await queryClient.invalidateQueries({
          queryKey: ['comments-by-post', { postId: reply.postId }],
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['comments-by-parent', { commentId: reply.parentId }],
        });
      }
      setShowReplyBox((prev) => !prev);
      toast.success('Your reply has been added successfully.');
    } catch (error) {
      console.error('Failed to create reply comment:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const isLiked = useMemo(() => {
    return reply.likes?.some((id) => id.toString() === session?.user?.id);
  }, [reply.likes, session?.user?.id]);
  const isDisliked = useMemo(() => {
    return reply.dislikes?.some((id) => id.toString() === session?.user?.id);
  }, [reply.dislikes, session?.user?.id]);
  const likesCount = useMemo(() => {
    return reply.likes?.length || 0;
  }, [reply.likes]);
  const dislikesCount = useMemo(() => {
    return reply.dislikes?.length || 0;
  }, [reply.dislikes]);
  const repliesCount = useMemo(() => reply.replyCount || 0, [reply.replyCount]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn('group/reply', className)}
    >
      <div className="hover:bg-muted/30 flex gap-3 rounded-lg p-2 transition-colors">
        {/* Avatar - smaller for replies */}
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {reply?.author?.username?.charAt?.(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-1 flex items-center gap-2">
            <span className="text-foreground text-xs font-medium">{reply.author.name}</span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(reply.createdAt), {
                addSuffix: true,
                locale: enUS,
              })}
            </span>
            {reply.author.role === 'admin' && (
              <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                Admin
              </Badge>
            )}
          </div>

          {/* Reply Content */}
          {showEditBox ? (
            <CommentBox
              mode="edit"
              initialContent={reply.content}
              initialImages={reply.images}
              onSubmit={handleUpdateComment}
              isSubmitting={isUpdatingComment}
              onCancel={() => setShowEditBox(false)}
              showCancel={true}
            />
          ) : (
            <>
              <div className="text-foreground mb-2 text-xs leading-relaxed">{reply.content}</div>
              {/* Images if any */}
              {reply.images && reply.images.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {reply.images.map((image, imgIndex) => (
                    <motion.img
                      key={imgIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: imgIndex * 0.1 }}
                      src={image}
                      alt={`Reply image ${imgIndex + 1}`}
                      className="max-h-24 max-w-xs rounded-lg border object-cover"
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
                onClick={() => onLike?.(reply._id.toString())}
                className={cn(
                  'h-6 gap-1 px-2 transition-colors hover:bg-blue-50 hover:text-blue-600',
                  isLiked && 'bg-blue-50 text-blue-600',
                )}
              >
                <ThumbsUp className={cn('h-2.5 w-2.5', isLiked && 'fill-current')} />
                {likesCount > 0 && <span>{likesCount}</span>}
              </Button>

              {/* Dislike */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDislike?.(reply._id.toString())}
                className={cn(
                  'h-6 gap-1 px-2 transition-colors hover:bg-red-50 hover:text-red-600',
                  isDisliked && 'bg-red-50 text-red-600',
                )}
              >
                <ThumbsDown className={cn('h-2.5 w-2.5', isDisliked && 'fill-current')} />
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
                  className="text-muted-foreground hover:text-foreground h-8 gap-1 px-2 transition-colors"
                  onClick={() => {
                    setField('commentId', reply._id.toString());
                    setField('open', true);
                  }}
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
                    className="ml-auto h-6 w-6 p-0 opacity-0 transition-opacity group-hover/reply:opacity-100"
                  >
                    <MoreHorizontal className="h-2.5 w-2.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  {session?.user?.id === reply.author._id.toString() && (
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
                  {session?.user?.id === reply.author._id.toString() && (
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
        </div>
      </div>

      {/* Delete dialog confirm */}
      <ConfirmDialog
        open={showDialogDeleteConfirm}
        onOpenChange={setShowDialogDeleteConfirm}
        title="Delete this reply?"
        description="Are you sure you want to delete this reply? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isHandling={isDeletingComment}
        onConfirm={async () => {
          await handleDeleteComment(reply._id.toString());
        }}
      />
    </motion.div>
  );
};

export default CommentReply;
