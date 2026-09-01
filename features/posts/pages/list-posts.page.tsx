'use client';

import { PageHeader } from '@/components/shared/page-header';
import { ActionItem } from '@/components/shared/responsive-actions';
import { buttonVariants } from '@/components/ui/button';
import { appPath } from '@/constants/path';
import { Post } from '@/lib/generated/prisma/client';
import { EditIcon, PlusIcon, SendIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';
import { Suspense, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { PostTable, PostTableSkeleton } from '../components';
import { toPostFormValue } from '../data';
import { usePosts, usePostTableParams, useUpdatePost } from '../hooks';

export const ListPostsPageContent = () => {
  const router = useRouter();
  const { mutateAsync: updatePost, isPending: isPendingUpdate } = useUpdatePost();
  const getPostsRequest = usePostTableParams();

  const handlePublishToggle = useCallback(async (post: Post) => {
    try {
      await updatePost({
        path: { id: post.id },
        body: { ...toPostFormValue(post), status: post.status === 'Published' ? 'Draft' : 'Published' },
      });
      toast.success(`Post ${post.status === 'Published' ? 'unpublished' : 'published'} successfully!`);
    } catch (error) {
      console.error(error);
    }
  }, [updatePost]);

  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = usePosts(getPostsRequest);

  const baseActions = useMemo(
    (): ActionItem<Post>[] => [
      {
        key: 'edit',
        label: 'Edit',
        onClick: (post) => router.push(appPath.admin.post.edit(post.id)),
        tooltip: 'Edit',
        icon: <EditIcon />,
        group: 'main',
      },
      {
        key: 'publish-toggle',
        label: 'Publish/Unpublish',
        onClick: (post) => handlePublishToggle(post),
        tooltip: 'Publish/Unpublish',
        loading: isPendingUpdate,
        icon: <SendIcon />,
        group: 'main',
      }
    ],
    [router, handlePublishToggle, isPendingUpdate],
  );

  // const optimisticDeletePost = useOptimisticDeletePost();

  // const fullActions = useTableActionsWithOptimisticDelete({
  //   actions: baseActions,
  //   onOptimisticDelete: optimisticDeletePost.delete,
  //   queryKey: postQueryKeys.list(getPostsRequest),
  // });

  return (
    <div>
      <PageHeader
        title="Posts"
        description="Manage posts here"
        actions={
          <Link href={appPath.admin.post.new} className={buttonVariants({ variant: 'default' })}>
            <PlusIcon />
            New post
          </Link>
        }
      />
      <PostTable
        data={posts?.list ?? []}
        pageCount={posts?.meta?.pagination?.totalPages ?? -1}
        isLoading={postsLoading}
        error={postsError}
        refetch={() => refetchPosts()}
        actions={baseActions}
      />

      {/* <PostFormDialog
        open={formState.isOpen}
        onOpenChange={(open) => {
          if (!open) formState.close();
        }}
        initialData={initialData}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        serverErrors={serverError ? { root: serverError } : undefined}
        isEditMode={isEditMode}
        isLoading={isLoading}
        error={error}
      /> */}
    </div>
  );
};

export const ListPostsPage = () => {
  return (
    <Suspense
      fallback={
        <div>
          <PageHeader title="Posts" description="Manage posts" />
          <PostTableSkeleton rowCount={10} />
        </div>
      }
    >
      <ListPostsPageContent />
    </Suspense>
  );
};
