'use client';

import { userApi } from '@/apis/user';
import ErrorMessage from '@/components/shared/error-message';
import { Label } from '@/components/ui/label';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useEffectEvent, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { PostSchema } from '../../../../../schema';

export const AuthorMultipleSelect = () => {
  const { data: session } = useSession();
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PostSchema>();

  const authorsFromForm = watch('authors');

  const { data: users, isLoading: isUserLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers({ page: 1, limit: 100 }),
  });

  useEffect(() => {
    if (session?.user && (!authorsFromForm || authorsFromForm.length === 0)) {
      setValue('authors', [session.user.id as string]);
    }
  }, [session?.user, setValue, authorsFromForm]);

  // Author options - make it stateful
  const [authorOptions, setAuthorOptions] = useState<MultiSelectOption[]>([]);

  const setAuthorOptionsEffect = useEffectEvent(() => {
    if (!isUserLoading && users) {
      setAuthorOptions(() => {
        return users.data.map((user) => ({
          label: user.name || user.username,
          value: user._id.toString(),
          icon: User,
        }));
      });
    }
  });

  useEffect(() => {
    setAuthorOptionsEffect();
  }, [isUserLoading, users]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Authors</Label>
      {isUserLoading ? (
        <Skeleton className="h-10 w-full rounded-md" />
      ) : (
        <Controller
          name="authors"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={authorOptions}
              onValueChange={field.onChange}
              defaultValue={field.value || []}
              placeholder="Select authors..."
              searchable={true}
              className="w-full max-w-[300px]"
              maxCount={3}
            />
          )}
        />
      )}
      <ErrorMessage message={errors.authors?.message} />
    </div>
  );
};

export default AuthorMultipleSelect;
