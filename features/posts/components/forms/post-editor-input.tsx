import GhostLikeEditor from '@/components/my-lexical-editor/GhostLikeEditor';
import { useFormContext } from 'react-hook-form';
import { PostFormValues } from '../../schemas';

export const PostEditorInput = () => {
  const { getValues, setValue } = useFormContext<PostFormValues>();

  const initialValue = getValues('content');

  const handleContentChange = (newContent: string) => {
    setValue('content', newContent, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="my-editor relative ml-9">
      <GhostLikeEditor initialContent={initialValue} onChange={handleContentChange} />
    </div>
  );
};
