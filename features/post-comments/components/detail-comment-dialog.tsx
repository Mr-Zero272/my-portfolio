import { commentsApi } from '@/apis/comments';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/shared/responsive-dialog';
import { EmptyState } from '@/components/shared/state';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useDetailCommentStore } from '../store/use-detail-comment';
import Comment, { CommentSkeleton } from './comment';
import CommentBox from './comment-box';

const DetailCommentDialog = () => {
  const { commentId, open, setField } = useDetailCommentStore();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const {
    data: commentDetail,
    isLoading: isFetchingCommentDetail,
    isError: isErrorCommentDetail,
    refetch: refetchCommentDetail,
  } = useQuery({
    queryKey: ['comment-detail', { commentId }],
    queryFn: () => commentsApi.getCommentDetailById({ commentId: commentId! }),
    enabled: !!commentId,
  });

  const { mutateAsync: createComment, isPending: isCreatingComment } = useMutation({
    mutationFn: commentsApi.crateComment,
  });

  const handleReply = async (content: string, images?: string[]) => {
    try {
      if (!commentDetail?.data?.comment) return;

      await createComment({
        data: {
          postId: commentDetail?.data?.comment.postId,
          content,
          images,
          author: session?.user?.id,
          parentId: commentDetail?.data?.comment._id.toString(),
        },
      });
      // Invalidate comment-detail query to refetch the comment with updated replies
      await queryClient.invalidateQueries({
        queryKey: ['comment-detail', { commentId }],
      });
      toast.success('Your reply has been added successfully.');
    } catch (error) {
      console.error('Failed to create reply comment:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  if (isFetchingCommentDetail) {
    return Array.from({ length: 4 }, (_, index) => <CommentSkeleton key={index} />);
  }

  if (isErrorCommentDetail) {
    return (
      <EmptyState
        title="Failed to load comment details."
        description="Maybe this comment was deleted."
        action={
          <AnimatedButton onClick={() => refetchCommentDetail()}>
            <RotateCcw />
            Retry
          </AnimatedButton>
        }
      />
    );
  }

  // Merge replies from API response into comment object
  const commentWithReplies = commentDetail?.data?.comment
    ? {
        ...commentDetail.data.comment,
        replies: commentDetail.data.replies || commentDetail.data.comment.replies || [],
      }
    : undefined;

  return (
    <ResponsiveDialog open={open} onOpenChange={(isOpen) => setField('open', isOpen)}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Detail comment</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        {/* Content */}
        {commentWithReplies && <Comment comment={commentWithReplies} />}
        <ResponsiveDialogFooter>
          <CommentBox
            isMobileMode
            placeholder="Reply this comment"
            onSubmit={handleReply}
            isSubmitting={isCreatingComment}
          />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default DetailCommentDialog;
