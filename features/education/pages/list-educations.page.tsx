'use client';

import ConfirmDialog from '@/components/shared/confirm-dialog';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { useActionState } from '@/hooks/use-action-state';
import { useFormActionState } from '@/hooks/use-form-actions-state';
import { handleError } from '@/utils';
import { Education } from '@prisma/client';
import { PlusIcon, TriangleAlertIcon } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { EducationFormDialog, EducationList } from '../components';
import { useDeleteEducation, useEducationForm, useEducations } from '../hooks';

export type ListEducationsPageProps = {
  data: Education[];
  isLoading?: boolean;
  onEdit?: (education: Education) => void;
  onDelete?: (education: Education) => void;
};

export const ListEducationsPage = () => {
  const { data, isLoading: isLoadingEducations, error: errorEducations } = useEducations();
  const formAction = useFormActionState<Education>();
  const deleteAction = useActionState<Education>();
  const handleSuccess = useCallback(() => {
    if (formAction.payload) {
      toast.success('Education updated successfully');
    } else {
      toast.success('Education created successfully');
    }
    formAction.close();
  }, [formAction]);

  const {
    serverError,
    isEditMode,
    isLoading: isFormLoading,
    error: formError,
    initialData,
    onSubmit,
    isSubmitting,
  } = useEducationForm({ id: formAction.payload?.id, onSuccess: handleSuccess });
  const { mutateAsync: deleteEducation } = useDeleteEducation();

  const handleDeleteEducation = useCallback(async () => {
    if (!deleteAction.payload) return;
    try {
      await deleteEducation({ path: { id: deleteAction.payload.id } });
      toast.success('Education deleted successfully');
      deleteAction.close();
    } catch (error) {
      handleError({ error, withToast: true });
    }
  }, [deleteAction, deleteEducation]);

  return (
    <div className="max-w-2xl pb-20">
      <PageHeader
        title="Educations"
        description="Manage your education history. Add, edit, or delete your educational qualifications."
        actions={
          <Button onClick={() => formAction.openCreate()}>
            <PlusIcon />
            Add Education
          </Button>
        }
      />
      <EducationList
        data={data?.list ?? []}
        isLoading={isLoadingEducations}
        error={errorEducations}
        onCreate={() => formAction.openCreate()}
        onEdit={formAction.openEdit}
        onDelete={deleteAction.open}
        mode="edit"
      />

      <EducationFormDialog
        open={formAction.isOpen}
        onOpenChange={(open) => {
          if (!open) formAction.close();
        }}
        isLoading={isFormLoading}
        error={formError}
        initialData={initialData}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        serverErrors={{ root: serverError ?? undefined }}
        isEditMode={isEditMode}
      />

      <ConfirmDialog
        variant="destructive"
        icon={<TriangleAlertIcon />}
        title="Delete Education"
        description={`Are you sure you want to delete this education "${deleteAction.payload?.institution}"?`}
        open={deleteAction.isOpen}
        onOpenChange={(open) => {
          if (!open) deleteAction.close();
        }}
        onConfirm={handleDeleteEducation}
      />
    </div>
  );
};
