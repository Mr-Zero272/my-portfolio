import { ButtonWithTooltip } from '@/components/shared/button-with-tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useGenerateKeywords } from '@/features/posts/hooks';
import { handleError } from '@/utils';
import { PlusIcon, SparklesIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, ControllerRenderProps, FieldValues, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

export const PostKeywordsInput = () => {
  const { control, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const { isPending: isGeneratingWithAI, mutateAsync: aiGenerateKeywords } = useGenerateKeywords();

  const generateKeywordsWithAI = async (field: ControllerRenderProps<FieldValues, 'keywords'>) => {
    const title = getValues('title');
    const content = getValues('content');

    if (!title || !content) {
      toast.warning(
        'Please enter a title and content for the post before generating keywords with AI.',
      );
      return;
    }

    try {
      const keywords = await aiGenerateKeywords({ body: { content, title } });
      field.onChange([...field.value, ...keywords]);
    } catch (error) {
      handleError({
        error,
        withToast: true,
      });
    }
  };

  return (
    <Controller
      name="keywords"
      control={control}
      render={({ field }) => {
        return (
          <Field>
            <FieldLabel htmlFor="keywords-input" className="text-sm font-medium">
              Keywords
            </FieldLabel>

            <div className="flex gap-2">
              <Input
                id="keywords-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const trimmed = inputValue.trim();
                    const newValue = field.value || [];
                    if (trimmed && !newValue.includes(trimmed)) {
                      newValue.push(trimmed);
                      field.onChange(newValue);
                      setInputValue('');
                    } else {
                      toast.warning('Keyword already exists');
                    }
                  }
                }}
                placeholder="Add keyword..."
                className="flex-1"
              />
              <ButtonWithTooltip
                onClick={() => {
                  const trimmed = inputValue.trim();
                  const newValue = field.value || [];
                  if (trimmed && !newValue.includes(trimmed)) {
                    newValue.push(trimmed);
                    field.onChange(newValue);
                    setInputValue('');
                  } else {
                    toast.warning('Keyword already exists');
                  }
                }}
                size="icon"
                variant="outline"
                type="button"
                disabled={!inputValue.trim()}
                tooltip="Add keyword"
              >
                <PlusIcon />
              </ButtonWithTooltip>
            </div>

            <Button
              onClick={() => generateKeywordsWithAI(field)}
              size="sm"
              variant="secondary"
              type="button"
              disabled={isGeneratingWithAI}
              className="w-full"
            >
              {isGeneratingWithAI ? <Spinner /> : <SparklesIcon />}
              {isGeneratingWithAI ? 'Generating...' : 'Generate with AI'}
            </Button>

            {field.value?.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {field.value.map((keyword: string) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      <span className="text-xs">{keyword}</span>
                      <button
                        onClick={() => {
                          const newValue = field.value.filter((k: string) => k !== keyword);
                          field.onChange(newValue);
                        }}
                        className="hover:text-destructive rounded-full p-0.5 transition-colors"
                        type="button"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs">
                  {field.value?.length || 0} keyword{(field.value?.length || 0) !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </Field>
        );
      }}
    />
  );
};
