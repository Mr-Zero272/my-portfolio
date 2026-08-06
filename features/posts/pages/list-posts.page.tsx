'use client';

import { PageHeader } from '@/components/shared/page-header copy';
import { ActionItem } from '@/components/shared/responsive-actions';
import { useFormState } from '@/hooks/use-form-state';
import { Post } from '@/lib/generated/prisma/client';
import { EditIcon } from 'lucide-react';
import { Suspense, useMemo } from 'react';
import { PostTable, PostTableSkeleton } from '../components';
import { usePosts, usePostTableParams } from '../hooks';

export const ListPostsPageContent = () => {
  // form
  const formState = useFormState<Post>();

  // const handleSuccess = useCallback(() => {
  //   formState.close();
  // }, [formState]);

  // const { serverError, isEditMode, isLoading, error, initialData, onSubmit, isSubmitting } =
  //   usePostForm({ id: formState.cachedPayload?.id, onSuccess: handleSuccess });

  //  table
  const getPostsRequest = usePostTableParams();

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
        onClick: formState.edit,
        tooltip: 'Edit',
        icon: <EditIcon />,
      },
    ],
    [formState.edit],
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
        description="Manage posts"
        // actions={
        //   <Button onClick={() => formState.create()}>
        //     <PlusIcon />
        //     Add posts
        //   </Button>
        // }
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
