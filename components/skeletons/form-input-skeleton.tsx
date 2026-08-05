import { Field } from '../ui/field';
import { Skeleton } from '../ui/skeleton';

export const FormInputSkeleton = () => {
  return (
    <Field>
      <Skeleton className="max-w-32 h-5 rounded-md" />
      <Skeleton className="h-8 w-full max-w-md rounded-md" />
    </Field>
  );
};
