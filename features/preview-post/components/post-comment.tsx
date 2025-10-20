import { commentsApi } from '@/apis/comments';
import PostCommentFeature from '@/features/post-comments';
import { CommentBox } from '@/features/post-comments/components';
import DetailCommentDialog from '@/features/post-comments/components/detail-comment-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'nextjs-toploader/app';
import { toast } from 'sonner';

type PostCreateCommentProps = {
  postId: string;
};

const PostComment = ({ postId }: PostCreateCommentProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { mutateAsync: createComment, isPending: isCreatingComment } = useMutation({
    mutationFn: commentsApi.crateComment,
  });

  const handleCreateComment = async (content: string, images?: string[]) => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
    }

    try {
      await createComment({
        data: {
          postId,
          content,
          images,
          author: session?.user?.id,
        },
      });
      // Invalidate comments query to refetch comments
      await queryClient.invalidateQueries({
        queryKey: ['comments-by-post', { postId }],
      });
      toast.success('Your comment has been added successfully.');
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Failed to create comment:', error);
    }
  };

  return (
    <>
      <CommentBox onSubmit={handleCreateComment} isSubmitting={isCreatingComment} />
      <PostCommentFeature postId={postId} />
      <DetailCommentDialog />
    </>
  );
};

export default PostComment;
