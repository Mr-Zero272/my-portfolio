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
import { uploadFile } from '@/lib/uploadthing';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';
import Editor from './components/editor';
import PostSidebar from './components/sidebar';
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
  const queryClient = useQueryClient();
  const [postDraft, setPostDraft, removePostDraft] = useLocalStorage('post_draft', '');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const router = useRouter();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<SubmitOption>('save');
  const { open, setOpen } = useSidebar();

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

  const {
    _id: postId,
    authors,
    tags,
    title,
    content,
    keywords,
    excerpt,
    featureImage,
    featureImageFile,
    slug,
    imageCaption,
    metaTitle,
    metaDescription,
    xMetaTitle,
    xMetaDescription,
    xMetaImage,
    xMetaImageFile,
    published,
    validateForm,
    getCurrentState,
    setField,
  } = usePostStorage();

  const handleSubmitPost = useCallback(
    async ({ option = 'save', action = 'create', noToast = false }: SubmitParams) => {
      setCurrentAction(option);

      // Validate form before proceeding
      if (!validateForm()) {
        toast.error('Please fill in all required fields before submitting.');
        if (!open) {
          setIsSaveDialogOpen(false);
          setTimeout(() => setOpen(true), 0);
        }
        return;
      }

      try {
        // Handle file uploads
        let finalFeatureImage = featureImage;
        let finalXMetaImage = xMetaImage;

        if (featureImageFile) {
          const res = await uploadFileAsync(featureImageFile);
          setField('featureImageFile', null);
          setField('featureImage', res.data.url);
          finalFeatureImage = res.data.url;
        }

        if (xMetaImageFile) {
          const res = await uploadFileAsync(xMetaImageFile);
          setField('xMetaImageFile', null);
          setField('xMetaImage', res.data.url);
          finalXMetaImage = res.data.url;
        }

        // Prepare post body
        const postBody = {
          title,
          slug,
          content,
          keywords,
          authors,
          tags,
          excerpt,
          featureImage: finalFeatureImage,
          imageCaption,
          metaTitle,
          metaDescription,
          xMetaTitle,
          xMetaDescription,
          xMetaImage: finalXMetaImage,
          published: option === 'publish',
        };

        // Execute action
        if (action === 'create') {
          await createPost({ data: postBody });
          if (!noToast) toast.success('Post created successfully');
          router.push('/piti/posts');
        } else {
          await updatePost({
            postId: postId,
            data: postBody,
          });
          if (!noToast) toast.success('Post updated successfully');
          setIsSaveDialogOpen(false);
        }

        // Update draft in local storage
        setPostDraft(JSON.stringify(getCurrentState()));
      } catch (error) {
        const errorMessage = isAxiosError(error)
          ? error.response?.data?.message || 'An unexpected error occurred. Please try again.'
          : 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
      }
    },
    [
      router,
      excerpt,
      createPost,
      updatePost,
      uploadFileAsync,
      validateForm,
      title,
      slug,
      content,
      keywords,
      authors,
      tags,
      featureImage,
      featureImageFile,
      imageCaption,
      metaTitle,
      metaDescription,
      xMetaTitle,
      xMetaDescription,
      xMetaImage,
      xMetaImageFile,
      postId,
      setField,
      open,
      setOpen,
      getCurrentState,
      setPostDraft,
    ],
  );

  const isLoading = useMemo(
    () => isCreatingPost || isUploading || isUpdatingPost,
    [isCreatingPost, isUploading, isUpdatingPost],
  );

  useEffect(() => {
    // auto save draft every 2 minutes
    let timeout: NodeJS.Timeout;

    const saveDraft = async () => {
      // Clear existing timeout if any
      if (timeout) clearTimeout(timeout);

      setIsSavingDraft(true);
      setPostDraft(JSON.stringify(getCurrentState()));

      timeout = setTimeout(() => {
        setIsSavingDraft(false);
      }, 1000);
    };

    const interval = setInterval(saveDraft, 120000); // 2 minutes

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [getCurrentState, setPostDraft]);

  const handleMainButtonClick = useCallback(() => {
    if (mode === 'create') {
      setIsSaveDialogOpen(true);
      return;
    }

    // For edit mode, directly save/update if already published
    // Otherwise show dialog for draft posts
    if (mode === 'edit' && !published) {
      setIsSaveDialogOpen(true);
      return;
    }

    handleSubmitPost({ action: 'update' });
  }, [mode, published, handleSubmitPost]);

  const handleBack = useCallback(() => {
    const hasUnsavedChanges = () => {
      if (mode === 'create') {
        return Boolean(title || content);
      }
      return postDraft && JSON.stringify(getCurrentState()) !== postDraft;
    };

    if (hasUnsavedChanges()) {
      setIsLeaveDialogOpen(true);
    } else {
      removePostDraft();
      router.back();
    }
  }, [mode, title, content, postDraft, getCurrentState, removePostDraft, router]);

  return (
    <>
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <AnimatedButton onClick={handleBack} variant="ghost" disabled={isLoading}>
              <ArrowLeft size={16} />
              <span className="ml-2">Back</span>
            </AnimatedButton>
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
            <Button variant="ghost" disabled={isSavingDraft || isLoading}>
              {isSavingDraft ? <RefreshCcw className="animate-spin" /> : null}
              {isSavingDraft ? 'Saving...' : 'Draft'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <AnimatedButton
              className="max-md:size-1o fixed right-4 bottom-4 z-50 max-md:rounded-full md:static"
              disabled={isLoading}
              onClick={handleMainButtonClick}
            >
              {isLoading ? 'Processing' : mode === 'create' ? 'Create' : 'Save'}
            </AnimatedButton>

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
                  <p className="text-muted-foreground text-sm">
                    You can save as draft or publish immediately. Published posts will be visible to everyone.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setIsSaveDialogOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleSubmitPost({ option: 'save', action: mode === 'create' ? 'create' : 'update' })
                    }
                    disabled={isLoading}
                  >
                    {isLoading && (currentAction === 'create' || currentAction === 'save')
                      ? 'Processing...'
                      : mode === 'create'
                        ? 'Create'
                        : 'Save'}
                  </Button>

                  <Button
                    onClick={() =>
                      handleSubmitPost({ option: 'publish', action: mode === 'create' ? 'create' : 'update' })
                    }
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
            <Button variant="outline" onClick={() => handleSubmitPost({ option: 'save' })} disabled={isLoading}>
              {isLoading && currentAction === 'save' ? 'Processing...' : 'Create'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                removePostDraft();
                router.back();
              }}
              disabled={isLoading}
            >
              Leave
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
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
