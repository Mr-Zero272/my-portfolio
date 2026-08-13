'use client';

import { UploadIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Field, FieldLabel } from '../ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '../ui/responsive-dialog';
import { Spinner } from '../ui/spinner';

interface UploadFromUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // submit props
  isSubmitting: boolean;
  onSubmit: (url: string) => void;
}

export const UploadFromUrlDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: UploadFromUrlDialogProps) => {
  const [url, setUrl] = useState('');

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);
    setUrl('');
  };

  const handleSubmit = async () => {
    await onSubmit(url);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Upload files from url</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Drag and drop or select files to upload.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <Field>
          <FieldLabel>File url</FieldLabel>
          <InputGroup>
            <InputGroupInput
              placeholder="http://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              {url && (
                <InputGroupButton onClick={() => setUrl('')}>
                  <XIcon className="size-4" />
                </InputGroupButton>
              )}
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : <UploadIcon />}
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
