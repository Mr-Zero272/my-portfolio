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
import { useFormActionState } from '@/hooks/use-form-actions-state';
import { Edit2Icon, EllipsisVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useCallback } from 'react';
import { ListSkills, SkillFormDialog } from '../components';
import { useSkills } from '../hooks/queries';
import { useSkillForm } from '../hooks/use-skill-form';
import { SkillWithAllRelations } from '../types';

export const ListSkillsPage = () => {
  const formAction = useFormActionState<SkillWithAllRelations>();
  const { data: skills, isLoading: isLoadingSkills, error: errorSkills } = useSkills();
  const {
    isEditMode,
    isLoading: isLoadingForm,
    isSubmitting: isSubmittingForm,
    error: errorForm,
    initialData,
    onSubmit,
    originalData,
  } = useSkillForm({ id: formAction.payload?.id, onSuccess: formAction.close });

  const renderActions = useCallback(
    (skill: SkillWithAllRelations) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button size="icon-sm" variant="ghost" />}>
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => formAction.openEdit(skill)}>
                <Edit2Icon />
                Edit Skill
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Delete Skill
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    [formAction],
  );

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Skills"
        description="Manage your skills"
        actions={
          <Button onClick={formAction.openCreate}>
            <PlusIcon />
            Add Skill
          </Button>
        }
      />
      <ListSkills
        skills={skills?.list ?? []}
        isLoading={isLoadingSkills}
        mode="private"
        error={errorSkills}
        onCreateNew={formAction.openCreate}
        renderActions={renderActions}
      />

      <SkillFormDialog
        open={formAction.isOpen}
        onOpenChange={(open) => {
          if (!open) formAction.close();
        }}
        isEditMode={isEditMode}
        isLoading={isLoadingForm}
        error={errorForm}
        initialData={initialData}
        onSubmit={onSubmit}
        isSubmitting={isSubmittingForm}
        context={{
          icon: originalData?.icon ?? undefined,
        }}
      />
    </div>
  );
};
