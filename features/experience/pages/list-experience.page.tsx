'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useActionState } from '@/hooks/use-action-state';
import { useFormActionState } from '@/hooks/use-form-actions-state';
import { Edit2Icon, MoreHorizontalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useCallback } from 'react';
import { ExperienceFormDialog, ListWorkExperience } from '../components';
import { useExperienceForm, useExperiences } from '../hooks';
import { ExperienceWithAllRelations } from '../types';

export const ListExperiencePage = () => {
  const {
    data: experiencesData,
    isLoading: experienceLoading,
    error: experienceError,
  } = useExperiences();
  const formAction = useFormActionState<ExperienceWithAllRelations>();
  const deleteAction = useActionState<ExperienceWithAllRelations>();

  const {
    serverError,
    isEditMode,
    isLoading,
    error,
    initialData,
    onSubmit,
    isSubmitting,
    originalData,
  } = useExperienceForm({
    id: formAction.payload?.id,
  });

  const renderPrivateActions = useCallback(
    (experience: ExperienceWithAllRelations) => {
      return (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => formAction.openEdit(experience)}>
                  <Edit2Icon /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => deleteAction.open(experience)}
                >
                  <Trash2Icon /> Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    [deleteAction, formAction],
  );

  const handleCreateNew = useCallback(() => {
    formAction.openCreate();
  }, [formAction]);

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Work Experience"
        description="Manage your work experience"
        actions={
          <Button onClick={handleCreateNew}>
            <PlusIcon /> Add Experience
          </Button>
        }
      />

      <ListWorkExperience
        experiences={experiencesData?.list ?? []}
        isLoading={experienceLoading}
        error={experienceError}
        renderActions={renderPrivateActions}
        onCreateNew={handleCreateNew}
        mode="private"
      />

      <ExperienceFormDialog
        open={formAction.isOpen}
        onOpenChange={formAction.close}
        initialData={initialData}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        serverErrors={{ root: serverError || undefined }}
        error={error}
        isEditMode={isEditMode}
        isLoading={isLoading}
        context={{ companyLogo: originalData?.companyLogo ?? undefined }}
      />
    </div>
  );
};
