'use client';

import { PageHeader } from '@/components/shared/page-header copy';
import { ActionItem } from '@/components/shared/responsive-actions';
import { Button } from '@/components/ui/button';
import { useFormState } from '@/hooks/use-form-state';
import { Tag } from '@/lib/generated/prisma/client';
import type { QueryKey } from '@tanstack/react-query';
import { EditIcon, PlusIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { TagFormDialog, TagTable } from '../components';
import { useOptimisticDeleteTag, useTagForm } from '../hooks';

export const ListTagsPage = () => {
  const formState = useFormState<Tag>();
  const optimisticDeleteTag = useOptimisticDeleteTag();

  const handleSuccess = useCallback(() => {
    formState.close();
  }, [formState]);

  const { serverError, isEditMode, isLoading, error, initialData, onSubmit, isSubmitting } =
    useTagForm({ id: formState.cachedPayload?.id, onSuccess: handleSuccess });

  const tableActions = useMemo(
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

  const handleOptimisticDelete = useCallback(
    ({ data: tag, queryKey }: { data: Tag; queryKey: QueryKey }) => {
      optimisticDeleteTag.delete(tag, queryKey);
    },

    [optimisticDeleteTag],
  );

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
      <TagTable actions={tableActions} onOptimisticDelete={handleOptimisticDelete} />

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
