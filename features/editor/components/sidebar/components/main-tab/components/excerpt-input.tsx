import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { isEmptyHtml } from '@/lib/validate';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePostStorage } from '../../../../../store/use-post-storage';

const ExcerptInput = () => {
  const { excerpt, setField, title, content } = usePostStorage();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateExcerpt = async () => {
    if (!title || !content || isEmptyHtml(content)) {
      toast.error('Please provide a title and content to generate an excerpt.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/excerpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate excerpt');
      }

      if (data.excerpt) {
        setField('excerpt', data.excerpt);
        setField('metaDescription', data.excerpt);
        setField('xMetaDescription', data.excerpt);
        toast.success('Excerpt generated successfully!');
      }
    } catch (error) {
      console.error('Error generating excerpt:', error);
      toast.error('Failed to generate excerpt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="excerpt" className="text-sm font-medium">
          Excerpt
        </Label>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary h-6 px-2 text-xs"
          onClick={handleGenerateExcerpt}
          disabled={isGenerating}
        >
          <Sparkles className={cn('mr-1 size-3', isGenerating && 'animate-spin')} />
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </Button>
      </div>
      <Textarea
        id="excerpt"
        placeholder="Write a brief summary of the post..."
        className="min-h-[100px] resize-none"
        value={excerpt || ''}
        onChange={(e) => setField('excerpt', e.target.value)}
      />
      <p className="text-muted-foreground text-xs">
        Recommended length: up to 145 characters. Current length:{' '}
        <span
          className={cn('', {
            'text-destructive': excerpt && excerpt?.length > 145,
            'text-green-500': excerpt && excerpt?.length <= 145,
          })}
        >
          {excerpt?.length || 0}
        </span>
      </p>
    </div>
  );
};

export default ExcerptInput;
