'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ICommentResponse } from '@/models/Comment';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { MoreHorizontal, ThumbsDown, ThumbsUp } from 'lucide-react';

type CommentReplyProps = {
  reply: ICommentResponse;
  index: number;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId?: string;
  className?: string;
};

const CommentReply = ({ reply, index, onLike, onDislike, onDelete, currentUserId, className }: CommentReplyProps) => {
  const isLiked = reply.likes?.some((id) => id.toString() === currentUserId);
  const isDisliked = reply.dislikes?.some((id) => id.toString() === currentUserId);
  const likesCount = reply.likes?.length || 0;
  const dislikesCount = reply.dislikes?.length || 0;

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
      className={cn('group', className)}
    >
      <div className="hover:bg-muted/30 flex gap-3 rounded-lg p-3 transition-colors">
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
                locale: vi,
              })}
            </span>
            {reply.author.role === 'admin' && (
              <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                Admin
              </Badge>
            )}
          </div>

          {/* Reply Content */}
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

          {/* Actions */}
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

            {/* More actions */}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentReply;
