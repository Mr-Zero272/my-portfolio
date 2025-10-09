import ErrorMessage from '@/components/shared/error-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_URL } from '@/configs/env';
import { generateSlug } from '@/lib/slug';
import { LinkIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { usePostStorage } from '../../../../../store/use-post-storage';

const PostSlugInput = () => {
  const { title, slug, setField, errors } = usePostStorage();
  const prevTitleRef = useRef('');

  // Automatically generate slug from title
  useEffect(() => {
    const prevTitle = prevTitleRef.current;

    if (slug === generateSlug(prevTitle)) {
      setField('slug', generateSlug(title));
    }

    prevTitleRef.current = title;
  }, [title, slug, setField]);

  return (
    <div className="space-y-2">
      <Label htmlFor="postUrl" className="text-sm font-medium">
        Post URL
      </Label>
      <div className="relative">
        <LinkIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          id="postUrl"
          placeholder="https://example.com/your-post-url"
          className="pl-10"
          value={slug}
          onChange={(e) => {
            setField('slug', `${API_URL}/${e.target.value}`);
            setField('slug', e.target.value);
          }}
        />
      </div>
      <ErrorMessage message={errors.slug} />
    </div>
  );
};

export default PostSlugInput;
