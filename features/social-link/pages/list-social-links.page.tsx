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
import { SocialLink } from '@prisma/client';
import { Edit2Icon, EllipsisVerticalIcon, PlusIcon, Trash2Icon, TriangleAlertIcon } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ListSocialLinks, SocialLinkFormDialog } from '../components';
import { getSocialLinkPlatformLabel, SocialLinkPlatform } from '../constants';
import { useDeleteSocialLink, useSocialLinkForm, useSocialLinks } from '../hooks';

export const ListSocialLinksPage = () => {
  const formAction = useFormActionState<SocialLink>();
  const deleteAction = useActionState<SocialLink>();

  const { data, isLoading: isLoadingSocialLinks, error: errorSocialLinks } = useSocialLinks();

  const handleFormSuccess = useCallback(() => {
    if (formAction.payload) {
      toast.success('Social link updated successfully');
    } else {
      toast.success('Social link created successfully');
    }
    formAction.close();
  }, [formAction]);

  const {
    serverError,
    isEditMode,
    isLoading: isLoadingForm,
    error: errorForm,
    initialData,
    onSubmit,
    isSubmitting: isSubmittingForm,
  } = useSocialLinkForm({ id: formAction.payload?.id, onSuccess: handleFormSuccess });

  const { mutateAsync: deleteSocialLink } = useDeleteSocialLink();

  const handleDelete = useCallback(async () => {
    if (!deleteAction.payload) return;
    try {
      await deleteSocialLink({ path: { id: deleteAction.payload.id } });
      toast.success('Social link deleted successfully');
      deleteAction.close();
    } catch (err) {
      handleError({ error: err, withToast: true });
    }
  }, [deleteAction, deleteSocialLink]);

  const renderActions = useCallback(
    (socialLink: SocialLink) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button size="icon-sm" variant="ghost" />}>
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => formAction.openEdit(socialLink)}>
                <Edit2Icon />
                Edit Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => deleteAction.open(socialLink)}>
                <Trash2Icon />
                Delete Link
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    [deleteAction, formAction],
  );

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Social Links"
        description="Manage your social media profile links and contact handles"
        actions={
          <Button onClick={formAction.openCreate}>
            <PlusIcon />
            Add Social Link
          </Button>
        }
      />
      <ListSocialLinks
        socialLinks={data?.list ?? []}
        isLoading={isLoadingSocialLinks}
        mode="private"
        error={errorSocialLinks}
        onCreateNew={formAction.openCreate}
        renderActions={renderActions}
      />

      <SocialLinkFormDialog
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
        serverErrors={{ root: serverError ?? undefined }}
      />

      <ConfirmDialog
        variant="destructive"
        icon={<TriangleAlertIcon />}
        title="Delete Social Link"
        description={`Are you sure you want to delete "${
          deleteAction.payload
            ? getSocialLinkPlatformLabel(deleteAction.payload.platform as SocialLinkPlatform)
            : 'this social link'
        }"?`}
        open={deleteAction.isOpen}
        onOpenChange={(open) => {
          if (!open) deleteAction.close();
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};
