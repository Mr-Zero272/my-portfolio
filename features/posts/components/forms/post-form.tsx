'use client';

import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BaseFormProps } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon } from 'lucide-react';
import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DEFAULT_POST_FORM_VALUES, PostFormSchema, PostFormValues } from '../../schemas';
import { PostFeatureImageInput } from './post-feature-image-input';
import { PostFormSidebar } from './post-form-sidebar';
import { TitleFormInput } from './post-title-form-input';

const PostFormContent = ({
  initialData,
  onSubmit,
  onCancel,
  renderSubmitPart,
  className,
  isSubmitting,
  serverErrors,
  isEditMode,
}: BaseFormProps<PostFormValues>) => {
  const id = useId();
  const formId = `tag-form-${id}`;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: initialData ?? DEFAULT_POST_FORM_VALUES,
    mode: 'onTouched',
  });

  const isLocalSubmitting = form.formState.isSubmitting || isSubmitting || false;

  return (
    <FormProvider {...form}>
      <SidebarInset>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost">
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
              <Button className="fixed right-4 bottom-4 z-50 active:scale-90 md:static">
                Create
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
                  <PostFeatureImageInput />
                  <TitleFormInput />
                </div>
              </div>
            </div>
          </div>
        </form>
      </SidebarInset>
      <PostFormSidebar />
    </FormProvider>
  );
};

export const PostForm = (props: BaseFormProps<PostFormValues>) => {
  return (
    <SidebarProvider style={{ '--sidebar-width': '350px' } as React.CSSProperties}>
      <PostFormContent {...props} />
    </SidebarProvider>
  );
};
