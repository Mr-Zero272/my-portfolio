'use client';

import { PageHeader } from '@/components/shared/page-header copy';
import { ActionItem } from '@/components/shared/responsive-actions';
import { Button } from '@/components/ui/button';
import { useFormState } from '@/hooks/use-form-state';
import { useTableActionsWithOptimisticDelete } from '@/hooks/use-table-actions-with-optimistic-delete';
import { Tag } from '@/lib/generated/prisma/client';
import { EditIcon, PlusIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { TagFormDialog, TagTable } from '../components';
import { useOptimisticDeleteTag, useTagForm, useTags, useTagTableParams } from '../hooks';
import { tagQueryKeys } from '../services';

export const ListTagsPage = () => {
  // form
  const formState = useFormState<Tag>();

  const handleSuccess = useCallback(() => {
    formState.close();
  }, [formState]);

  const { serverError, isEditMode, isLoading, error, initialData, onSubmit, isSubmitting } =
    useTagForm({ id: formState.cachedPayload?.id, onSuccess: handleSuccess });

  //  table
  const getTagsRequest = useTagTableParams();

  const {
    data: tags,
    isLoading: tagsLoading,
    error: tagsError,
    refetch: refetchTags,
  } = useTags(getTagsRequest);

  const baseActions = useMemo(
    (): ActionItem<Tag>[] => [
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

  const optimisticDeleteTag = useOptimisticDeleteTag();

  const fullActions = useTableActionsWithOptimisticDelete({
    actions: baseActions,
    onOptimisticDelete: optimisticDeleteTag.delete,
    queryKey: tagQueryKeys.list(getTagsRequest),
  });

  return (
    <div>
      <PageHeader
        title="Tags"
        description="Manage tags"
        actions={
          <Button onClick={() => formState.create()}>
            <PlusIcon />
            Add tags
          </Button>
        }
      />
      <TagTable
        data={tags?.list ?? []}
        pageCount={tags?.meta?.pagination?.totalPages ?? -1}
        isLoading={tagsLoading}
        error={tagsError}
        refetch={() => refetchTags()}
        actions={fullActions}
      />

      <TagFormDialog
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
      />
    </div>
  );
};
