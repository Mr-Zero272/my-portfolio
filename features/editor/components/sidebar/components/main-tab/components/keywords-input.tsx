'use client';

import { AnimatedButton } from '@/components/ui/animated-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isEmptyHtml } from '@/utils/validate';
import { Loader2, Plus, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { PostSchema } from '../../../../../schema';

const KeywordsInput = () => {
  const { setValue, watch } = useFormContext<PostSchema>();
  const keywords = watch('keywords') || [];
  const title = watch('title') || '';
  const content = watch('content') || '';

  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddKeyword = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !keywords.includes(trimmedValue)) {
      setValue('keywords', [...keywords, trimmedValue], { shouldDirty: true });
      setInputValue('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setValue(
      'keywords',
      keywords.filter((keyword) => keyword !== keywordToRemove),
      { shouldDirty: true }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const generateKeywordsWithAI = async () => {
    if (!title.trim() || !content.trim() || isEmptyHtml(content)) {
      toast.error('Please provide title and content to generate keywords');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate keywords');
      }

      const data = await response.json();

      if (data.keywords && Array.isArray(data.keywords)) {
        // Merge existing keywords with new ones, avoiding duplicates
        const newKeywords = data.keywords.filter((keyword: string) => !keywords.includes(keyword));
        setValue('keywords', [...keywords, ...newKeywords], { shouldDirty: true });

        toast.success(`Generated ${newKeywords.length} new keywords`);
      }
    } catch (error) {
      console.error('Error generating keywords:', error);
      toast.error('Failed to generate keywords. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="keywords-input" className="text-sm font-medium">
        Keywords
      </Label>

      <div className="flex gap-2">
        <Input
          id="keywords-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Add keyword..."
          className="flex-1"
        />
        <AnimatedButton onClick={handleAddKeyword} size="sm" variant="outline" disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4" />
        </AnimatedButton>
      </div>

      <Button
        onClick={generateKeywordsWithAI}
        size="sm"
        variant="secondary"
        disabled={isGenerating || (!title.trim() && !content.trim())}
        className="w-full"
      >
        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        {isGenerating ? 'Generating...' : 'Generate with AI'}
      </Button>

      {keywords.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                <span className="text-xs">{keyword}</span>
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-1 rounded-full p-0.5 transition-colors hover:bg-red-500 hover:text-white"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {keywords.length} keyword{keywords.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default KeywordsInput;
