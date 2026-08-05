import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { slugify } from '@/lib/slug';

interface UseSlugSyncOptions {
  name: string; // field slug
  sourceName: string; // field bị theo dõi, vd 'name'
  isEditMode?: boolean; // đang edit record có sẵn slug -> khoá auto-gen
}

export function useSlugSync({ name, sourceName, isEditMode }: UseSlugSyncOptions) {
  const { control, getValues, setValue } = useFormContext();

  const sourceValue = useWatch({ control, name: sourceName });
  const slugValue = useWatch({ control, name });

  const lastAutoValueRef = useRef('');
  const initializedRef = useRef(false);

  // Baseline lúc mount
  useEffect(() => {
    const currentSlug = getValues(name) ?? '';
    const currentSource = getValues(sourceName) ?? '';
    const generated = slugify(currentSource);

    // Edit mode mà đã có slug sẵn -> coi baseline = chính slug đó,
    // không tự ý regenerate chỉ vì nó "tình cờ" trùng slugify(name).
    lastAutoValueRef.current = isEditMode && currentSlug ? currentSlug : generated;
    initializedRef.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Đồng bộ khi source đổi
  useEffect(() => {
    if (!initializedRef.current) return;

    const currentSlug = getValues(name) ?? '';
    const generated = slugify(sourceValue ?? '');
    const isFollowingSource = currentSlug === '' || currentSlug === lastAutoValueRef.current;

    if (isFollowingSource && currentSlug !== generated) {
      setValue(name, generated, { shouldDirty: true, shouldValidate: true });
    }

    lastAutoValueRef.current = generated;
  }, [sourceValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const generatedPreview = slugify(sourceValue ?? '');
  const isManual = Boolean(slugValue) && slugValue !== generatedPreview;

  const resetSlug = () => {
    setValue(name, generatedPreview, { shouldDirty: true, shouldValidate: true });
    lastAutoValueRef.current = generatedPreview;
  };

  return { isManual, resetSlug };
}
