import { ButtonWithTooltip } from '@/components/shared/button-with-tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { PlusIcon, SparklesIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

export const PostKeywordsInput = () => {
  const { control, setValue, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const keywords: string[] =
    useWatch({
      control,
      name: 'keywords',
      defaultValue: [],
    }) || [];

  const handleAddKeyword = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setValue('keywords', [...keywords, trimmed], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setInputValue('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setValue(
      'keywords',
      keywords.filter((k: string) => k !== keywordToRemove),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const generateKeywordsWithAI = async () => {
    const title = getValues('title');
    const content = getValues('content');

    if (!title || !content) {
      toast.warning(
        'Please enter a title and content for the post before generating keywords with AI.',
      );
      return;
    }

    setIsGenerating(true);
    try {
      // AI keyword extraction placeholder
    } finally {
      setIsGenerating(false);
    }
  };

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
          onKeyDown={handleKeyPress}
          placeholder="Add keyword..."
          className="flex-1"
        />
        <ButtonWithTooltip
          onClick={handleAddKeyword}
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
        onClick={generateKeywordsWithAI}
        size="sm"
        variant="secondary"
        type="button"
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? <Spinner /> : <SparklesIcon />}
        {isGenerating ? 'Generating...' : 'Generate with AI'}
      </Button>

      {keywords.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="text-xs">{keyword}</span>
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:text-destructive rounded-full p-0.5 transition-colors"
                  type="button"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            {keywords.length} keyword{keywords.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </Field>
  );
};
