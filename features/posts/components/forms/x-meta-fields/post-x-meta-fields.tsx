'use client';

import { FormInput, FormTextArea } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { env } from '@/config/env';
import { ChevronLeftIcon } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { XPreview } from './x-preview';

export const PostXMetaFields = ({
  onTabChange,
}: {
  onTabChange: (tab: 'main' | 'metadata' | 'x_metadata') => void;
}) => {
  const { control } = useFormContext();
  const xMetaTitle = useWatch({
    name: 'xMetaTitle',
    control,
  });
  const xMetaDescription = useWatch({
    name: 'xMetaDescription',
    control,
  });
  const slug = useWatch({
    name: 'slug',
    control,
  });

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={() => onTabChange('main')}>
          <ChevronLeftIcon />
        </Button>
        <h2 className="font-medium">X (Twitter) Metadata</h2>
      </div>
      <FieldGroup>
        <FormInput label="Meta title" name="xMetaTitle" placeholder="Enter meta title" />
        <FormTextArea
          label="Meta description"
          name="xMetaDescription"
          placeholder="Enter meta description"
          description={`Recommended: 50-160 characters ${xMetaDescription?.length}/160`}
          aria-invalid={xMetaDescription?.length > 160}
        />
      </FieldGroup>

      <XPreview title={xMetaTitle} url={`${env.SITE_URL}/post/${slug}`} />
    </div>
  );
};
