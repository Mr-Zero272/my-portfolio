import ErrorMessage from '@/components/shared/error-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateSlug } from '@/utils/slug';
import { LinkIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { PostSchema } from '../../../../../schema';

const PostSlugInput = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PostSchema>();

  const title = watch('title');
  const slug = watch('slug');
  const prevTitleRef = useRef('');

  // Automatically generate slug from title
  useEffect(() => {
    const prevTitle = prevTitleRef.current;
    const currentGeneratedSlug = generateSlug(prevTitle);

    // Only update slug if it was currently matching the generated slug of the previous title
    // or if it's empty
    if (!slug || slug === currentGeneratedSlug) {
      setValue('slug', generateSlug(title), { shouldDirty: true });
    }

    prevTitleRef.current = title;
  }, [title, slug, setValue]);

  return (
    <div className="space-y-2">
      <Label htmlFor="postUrl" className="text-sm font-medium">
        Post URL
      </Label>
      <div className="relative">
        <LinkIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          id="postUrl"
          placeholder="your-post-slug"
          className="pl-10"
          {...register('slug')}
        />
      </div>
      <ErrorMessage message={errors.slug?.message} />
    </div>
  );
};

export default PostSlugInput;
