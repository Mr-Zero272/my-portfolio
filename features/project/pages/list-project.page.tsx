'use client';

import ConfirmDialog from '@/components/shared/confirm-dialog';
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
import { handleError } from '@/utils';
import {
  Edit2Icon,
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ListProjects, ProjectFormDialog } from '../components';
import { useDeleteProject, useProjectForm, useProjects } from '../hooks';
import { ProjectWithAllRelations } from '../types';

export const ListProjectPage = () => {
  const { data: projectsData, isLoading: projectsLoading, error: projectsError } = useProjects();

  const formAction = useFormActionState<ProjectWithAllRelations>();
  const deleteAction = useActionState<ProjectWithAllRelations>();

  const handleSuccess = useCallback(() => {
    if (formAction.payload) {
      toast.success('Project updated successfully');
    } else {
      toast.success('Project created successfully');
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
    originalData,
  } = useProjectForm({ id: formAction.payload?.id, onSuccess: handleSuccess });

  const { mutateAsync: deleteProject } = useDeleteProject();

  const handleDeleteProject = useCallback(async () => {
    if (!deleteAction.payload) return;
    try {
      await deleteProject({ path: { id: deleteAction.payload.id } });
      toast.success('Project deleted successfully');
      deleteAction.close();
    } catch (error) {
      handleError({ error, withToast: true });
    }
  }, [deleteAction, deleteProject]);

  const renderPrivateActions = useCallback(
    (project: ProjectWithAllRelations) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => formAction.openEdit(project)}>
                <Edit2Icon /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => deleteAction.open(project)}>
                <Trash2Icon /> Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    [deleteAction, formAction],
  );

  const handleCreateNew = useCallback(() => {
    formAction.openCreate();
  }, [formAction]);

  return (
    <div className="max-w-5xl pb-20">
      <PageHeader
        title="Projects"
        description="Manage your projects. Add, edit, or delete your work."
        actions={
          <Button onClick={handleCreateNew}>
            <PlusIcon /> Add Project
          </Button>
        }
      />

      <ListProjects
        projects={projectsData?.list ?? []}
        isLoading={projectsLoading}
        error={projectsError}
        renderActions={renderPrivateActions}
        onCreateNew={handleCreateNew}
        mode="private"
      />

      <ProjectFormDialog
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
        context={{ images: originalData?.images ?? undefined }}
      />

      <ConfirmDialog
        variant="destructive"
        icon={<TriangleAlertIcon />}
        title="Delete Project"
        description={`Are you sure you want to delete this project "${deleteAction.payload?.name}"?`}
        open={deleteAction.isOpen}
        onOpenChange={(open) => {
          if (!open) deleteAction.close();
        }}
        onConfirm={handleDeleteProject}
      />
    </div>
  );
};
