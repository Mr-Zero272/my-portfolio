import GhostLikeEditor from '@/components/my-lexical-editor/GhostLikeEditor';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { PostFormValues } from '../../schemas';

export const PostEditorInput = () => {
  const { getValues, setValue } = useFormContext<PostFormValues>();

  const initialValue = getValues('content');

  const handleContentChange = useCallback(
    (jsonContent: string, htmlContent: string) => {
      setValue('content', jsonContent, { shouldDirty: true, shouldValidate: true });
      setValue('contentHtml', htmlContent, { shouldDirty: true, shouldValidate: true });
    },
    [setValue],
  );

  return (
    <div className="my-editor relative ml-9">
      <GhostLikeEditor initialContent={initialValue} onChange={handleContentChange} />
    </div>
  );
};
