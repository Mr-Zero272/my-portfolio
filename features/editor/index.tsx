'use client';
import { postApi } from '@/apis/post';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/shared/responsive-dialog';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { uploadFile, uploadImageWithDB } from '@/lib/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Editor from './components/editor';
import PostSidebar from './components/sidebar';
import { initialPostValues, postSchema, type PostSchema } from './schema';
import { usePostStorage } from './store/use-post-storage';

interface PostEditorProps {
  mode?: 'create' | 'edit';
}

type SubmitOption = 'save' | 'publish' | 'create';
type SubmitAction = 'create' | 'update';

interface SubmitParams {
  option?: SubmitOption;
  action?: SubmitAction;
  noToast?: boolean;
}

const PostEditorContent = ({ mode = 'create' }: PostEditorProps) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<SubmitOption>('save');
  const { open, setOpen } = useSidebar();

  const isSyncing = usePostStorage((state) => state.isSyncing);
  const storeState = usePostStorage();
  const resetState = usePostStorage((state) => state.resetState);

  const methods = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: initialPostValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    getValues,
  } = methods;

  // Sync initial state from store to form
  useEffect(() => {
    if (storeState._id) {
      reset(storeState);
    }
  }, [storeState._id, reset, storeState]);

  const { mutateAsync: createPost, isPending: isCreatingPost } = useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const { mutateAsync: uploadFileAsync, isPending: isUploading } = useMutation({
    mutationFn: (file: File) => uploadFile(file, 'mediaUploader'),
  });

  const { mutateAsync: updatePost, isPending: isUpdatingPost } = useMutation({
    mutationFn: postApi.updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const onSubmit = useCallback(
    async (data: PostSchema, option: SubmitOption = 'save') => {
      setCurrentAction(option);

      try {
        // Handle file uploads
        let finalFeatureImage = data.featureImage;
        let finalXMetaImage = data.xMetaImage;

        if (data.featureImageFile) {
          let res;
          if (session?.user?.id) {
            const imageUrl = await uploadImageWithDB(data.featureImageFile, session.user.id, 'imageUploader');
            res = { data: { url: imageUrl } };
          } else {
            res = await uploadFileAsync(data.featureImageFile);
          }
          methods.setValue('featureImageFile', null);
          methods.setValue('featureImage', res.data.url);
          finalFeatureImage = res.data.url;
        }

        if (data.xMetaImageFile) {
          let res;
          if (session?.user?.id) {
            const imageUrl = await uploadImageWithDB(data.xMetaImageFile, session.user.id, 'imageUploader');
            res = { data: { url: imageUrl } };
          } else {
            res = await uploadFileAsync(data.xMetaImageFile);
          }
          methods.setValue('xMetaImageFile', null);
          methods.setValue('xMetaImage', res.data.url);
          finalXMetaImage = res.data.url;
        }

        // Prepare post body
        const postBody = {
          ...data,
          keywords: data.keywords.filter((kw) => kw.trim() !== ''),
          featureImage: finalFeatureImage,
          xMetaImage: finalXMetaImage,
          published: option === 'publish',
        };

        // Execute action
        if (mode === 'create' && !data._id) {
          await createPost({ data: postBody });
          toast.success('Post created successfully');
          router.push('/piti/posts');
        } else {
          await updatePost({
            postId: data._id!,
            data: postBody,
          });
          toast.success('Post updated successfully');
          setIsSaveDialogOpen(false);
        }
      } catch (error) {
        const errorMessage = isAxiosError(error)
          ? error.response?.data?.message || 'An unexpected error occurred. Please try again.'
          : 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
      }
    },
    [createPost, uploadFileAsync, updatePost, session, router, methods, mode, setIsSaveDialogOpen],
  );

  const handleValidationFailed = useCallback(() => {
    toast.error('Please fill in all required fields before submitting.');
    if (!open) {
      setIsSaveDialogOpen(false);
      setTimeout(() => setOpen(true), 0);
    }
  }, [open, setOpen, setIsSaveDialogOpen]);

  const isLoading = useMemo(
    () => isCreatingPost || isUploading || isUpdatingPost,
    [isCreatingPost, isUploading, isUpdatingPost],
  );

  const handleMainButtonClick = useCallback(() => {
    if (mode === 'create') {
      setIsSaveDialogOpen(true);
      return;
    }

    const currentPublished = getValues('published');

    if (mode === 'edit' && !currentPublished) {
      setIsSaveDialogOpen(true);
      return;
    }

    handleSubmit((data) => onSubmit(data, currentPublished ? 'publish' : 'save'), handleValidationFailed)();
  }, [mode, handleSubmit, onSubmit, getValues, handleValidationFailed]);

  const handleBack = useCallback(() => {
    if (isDirty) {
      setIsLeaveDialogOpen(true);
    } else {
      resetState();
      router.back();
    }
  }, [isDirty, resetState, router]);

  const published = getValues('published');

  return (
    <FormProvider {...methods}>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <AnimatedButton onClick={handleBack} variant="ghost" disabled={isLoading}>
              <ArrowLeft size={16} />
              Back
            </AnimatedButton>
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
            <Button variant="ghost" disabled={isSyncing || isLoading}>
              {isSyncing ? <RefreshCcw className="animate-spin" /> : null}
              {isSyncing ? 'Saving...' : 'Synced'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="fixed right-4 bottom-4 z-50 active:scale-90 md:static"
              disabled={isLoading}
              onClick={handleMainButtonClick}
            >
              {isLoading ? 'Processing' : mode === 'create' ? 'Create' : 'Save'}
            </Button>

            <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Editor />
        </div>
      </SidebarInset>
      <PostSidebar side="right" />

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
                  <h2 className="text-2xl font-semibold">
                    Ready to {mode === 'create' ? 'create' : 'update'} your post?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    You can save as draft or publish immediately. Published posts will be visible to everyone.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setIsSaveDialogOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit((data) => onSubmit(data, 'save'), handleValidationFailed)()}
                    disabled={isLoading}
                  >
                    {isLoading && (currentAction === 'create' || currentAction === 'save')
                      ? 'Processing...'
                      : mode === 'create'
                        ? 'Create'
                        : 'Save'}
                  </Button>

                  <Button
                    onClick={() => handleSubmit((data) => onSubmit(data, 'publish'), handleValidationFailed)()}
                    disabled={isLoading}
                  >
                    {isLoading && currentAction === 'publish' ? 'Processing...' : 'Publish'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Unsaved Changes</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              You have unsaved changes. What would you like to do?
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter className="flex-row justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsLeaveDialogOpen(false)} disabled={isLoading}>
              Stay
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit((data) => onSubmit(data, 'save'), handleValidationFailed)()}
              disabled={isLoading}
            >
              {isLoading && currentAction === 'save' ? 'Processing...' : 'Create'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetState();
                router.back();
              }}
              disabled={isLoading}
            >
              Leave
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </FormProvider>
  );
};

const PostEditor = ({ mode = 'create' }: PostEditorProps) => {
  return (
    <SidebarProvider style={{ '--sidebar-width': '350px' } as React.CSSProperties}>
      <PostEditorContent mode={mode} />
    </SidebarProvider>
  );
};

export default PostEditor;
