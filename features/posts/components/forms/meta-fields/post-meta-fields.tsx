'use client';

import { FormInput, FormTextArea } from '@/components/forms';
import { ButtonWithTooltip } from '@/components/shared/button-with-tooltip';
import { FieldGroup } from '@/components/ui/field';
import { env } from '@/config/env';
import { ChevronLeftIcon } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { GoogleSearchPreview } from './google-search-preview';

export const PostMetaFields = ({
  onTabChange,
}: {
  onTabChange: (tab: 'main' | 'metadata' | 'x_metadata') => void;
}) => {
  const { control } = useFormContext();
  const metaTitle = useWatch({
    name: 'metaTitle',
    control,
  });
  const metaDescription = useWatch({
    name: 'metaDescription',
    control,
  });
  const slug = useWatch({
    name: 'slug',
    control,
  });

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center gap-2">
        <ButtonWithTooltip
          size="icon"
          variant="ghost"
          onClick={() => onTabChange('main')}
          tooltip="Back"
        >
          <ChevronLeftIcon />
        </ButtonWithTooltip>
        <h2 className="font-medium">Post Metadata</h2>
      </div>
      <FieldGroup>
        <FormInput label="Meta title" name="metaTitle" placeholder="Enter meta title" />
        <FormTextArea
          label="Meta description"
          name="metaDescription"
          placeholder="Enter meta description"
          description={`Recommended: 50-160 characters ${metaDescription?.length}/160`}
          aria-invalid={metaDescription?.length > 160}
        />
      </FieldGroup>

      <GoogleSearchPreview
        title={metaTitle}
        description={metaDescription}
        url={`${env.SITE_URL}/post/${slug}`}
      />
    </div>
  );
};
