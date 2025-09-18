import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { usePostStorage } from '../../../../../store/use-post-storge';

const ExcerptInput = () => {
  const { excerpt, setField } = usePostStorage();

  return (
    <div className="space-y-2">
      <Label htmlFor="excerpt" className="text-sm font-medium">
        Excerpt
      </Label>
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
