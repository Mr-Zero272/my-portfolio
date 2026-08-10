'use client';

import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import { GalleryImage, Tag } from '@/lib/generated/prisma/client';
import { PostStatus } from '@/lib/generated/prisma/enums';
import { BaseFormProps } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useId, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DEFAULT_POST_FORM_VALUES, PostFormSchema, PostFormValues } from '../../schemas';
import { PostEditorInput } from './post-editor-input';
import { PostFeatureImageInput } from './post-feature-image-input';
import { PostFormSidebar } from './post-form-sidebar';
import { TitleFormInput } from './post-title-form-input';

export type PostContext = {
  featureImage?: GalleryImage | null;
  selectedTags?: Tag[];
};

export type PostFormProps = BaseFormProps<PostFormValues, PostContext>;

const PostFormContent = ({
  initialData,
  onSubmit,
  // onCancel,
  // renderSubmitPart,
  // className,
  isSubmitting,
  // serverErrors,
  isEditMode,
  context,
}: PostFormProps) => {
  const id = useId();
  const formId = `tag-form-${id}`;
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: initialData ? (initialData as PostFormValues) : DEFAULT_POST_FORM_VALUES,
    // resetOptions: {
    //   keepDirtyValues: true, // Keep user's modified values if data updates in the background
    // },
    mode: 'onTouched',
  });

  const isLocalSubmitting = form.formState.isSubmitting || isSubmitting || false;

  // handle submit
  const handleSubmitForm = useCallback(
    (status?: PostStatus) => {
      if (status) form.setValue('status', status, { shouldDirty: true });
      form.handleSubmit((values) => {
        // console.log({
        //   values,
        // });
        // return;
        onSubmit(values);
      })();
    },
    [form, onSubmit],
  );

  const handlePublish = useCallback(() => {
    handleSubmitForm(PostStatus.Published);
  }, [handleSubmitForm]);

  const handleSaveAsDraft = useCallback(() => {
    handleSubmitForm(PostStatus.Draft);
  }, [handleSubmitForm]);

  return (
    <>
      {/** Main form */}
      <FormProvider {...form}>
        <SidebarInset>
          <form id={formId} className="flex flex-1 flex-col">
            <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.back()}>
                  <ArrowLeftIcon />
                  Back
                </Button>
                {/* <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
                <Button variant="ghost" disabled={isSyncing || isLoading}>
                  {isSyncing ? <RefreshCcw className="animate-spin" /> : null}
                  {isSyncing ? 'Saving...' : 'Synced'}
                </Button> */}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="fixed right-4 bottom-4 z-50 md:static"
                  onClick={() => setIsSaveDialogOpen(true)}
                >
                  {isEditMode ? 'Update' : 'Create'}
                </Button>

                <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
              </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4">
              <div
                style={{
                  padding: '0 20px',
                }}
              >
                <div className="mx-auto mt-5 mb-32 max-w-5xl overflow-hidden">
                  <div>
                    <PostFeatureImageInput featureImageFile={context.featureImage} />
                    <TitleFormInput />
                    {/* FIXME: thí component is not stable yet and have some error fix it later */}
                    <PostEditorInput />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </SidebarInset>
        <PostFormSidebar formContextData={context} />
      </FormProvider>

      {/** Dialogs */}
      <ResponsiveDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <ResponsiveDialogContent className="rounded-none border-none shadow-none max-md:px-5 max-md:pb-5 sm:grid-cols-1 sm:grid-rows-1 md:h-screen md:max-w-screen">
          <ResponsiveDialogHeader className="sr-only">
            <ResponsiveDialogTitle>Publish</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <div>
            <div className="font-semibold">Publish post</div>
            <div className="row-span-10 flex h-full w-full justify-center md:mt-40">
              <div className="max-w-2xl space-y-5">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Ready to publish your post?</h2>
                  <p className="text-muted-foreground text-sm">
                    You can save as draft or publish immediately. Published posts will be visible to
                    everyone.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsSaveDialogOpen(false)}
                    disabled={isLocalSubmitting}
                  >
                    Cancel
                  </Button>

                  {isLocalSubmitting ? (
                    <Button disabled variant="outline">
                      <Spinner />
                      Processing...
                    </Button>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleSaveAsDraft}>
                        Save as draft
                      </Button>

                      <Button onClick={handlePublish}>Publish</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
};

export const PostForm = (props: PostFormProps) => {
  return (
    <SidebarProvider style={{ '--sidebar-width': '350px' } as React.CSSProperties}>
      <PostFormContent {...props} />
    </SidebarProvider>
  );
};
