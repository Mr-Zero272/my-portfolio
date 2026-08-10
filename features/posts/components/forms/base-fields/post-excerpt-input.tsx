import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useGenerateExcerpt } from '@/features/posts/hooks';
import { PostFormValues } from '@/features/posts/schemas';
import { handleError } from '@/utils';
import { SparklesIcon } from 'lucide-react';
import { Controller, ControllerRenderProps, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

export const PostExcerptInput = () => {
  const { control, getValues } = useFormContext<PostFormValues>();
  const { mutateAsync: aiGenerateExcerpt, isPending } = useGenerateExcerpt();

  const generateExcerptWithAI = async (field: ControllerRenderProps<PostFormValues, 'excerpt'>) => {
    const title = getValues('title');
    const content = getValues('content');

    if (!title || !content) {
      toast.warning(
        'Please enter a title and content for the post before generating an excerpt with AI.',
      );
      return;
    }

    try {
      const excerpt = await aiGenerateExcerpt({ body: { content, title } });
      field.onChange(excerpt);
    } catch (error) {
      handleError({
        error,
        withToast: true,
      });
    }
  };

  return (
    <Controller
      control={control}
      name="excerpt"
      render={({ field, fieldState }) => (
        <Field>
          <div className="flex w-full items-center justify-between">
            <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => generateExcerptWithAI(field)}
              disabled={isPending}
            >
              {isPending ? <Spinner /> : <SparklesIcon />}
              {isPending ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>

          <Textarea
            {...field}
            id="excerpt"
            placeholder="Write a short summary of your post..."
            value={field.value ?? ''}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
