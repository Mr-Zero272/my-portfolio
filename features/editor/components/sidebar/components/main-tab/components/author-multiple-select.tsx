'use client';

import { userApi } from '@/apis/user';
import ErrorMessage from '@/components/shared/error-message';
import { Label } from '@/components/ui/label';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { usePostStorage } from '../../../../../store/use-post-storage';

export const AuthorMultipleSelect = () => {
  const { data: session } = useSession();
  console.log({
    session,
  });
  const { authors: authorsFromStorage, setField, errors } = usePostStorage();
  const { data: users, isLoading: isUserLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers({ page: 1, limit: 100 }),
  });

  useEffect(() => {
    if (session?.user) {
      setField('authors', [session.user.id as string]);
    }
  }, [session?.user, setField]);

  // Author options - make it stateful
  const [authorOptions, setAuthorOptions] = useState<MultiSelectOption[]>([]);

  useEffect(() => {
    if (!isUserLoading && users) {
      setAuthorOptions(() => {
        return users.data.map((user) => ({
          label: user.name || user.username,
          value: user._id.toString(),
          icon: User,
        }));
      });
    }
  }, [isUserLoading, users]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Authors</Label>
      {isUserLoading ? (
        <Skeleton className="h-10 w-full rounded-md" />
      ) : (
        <MultiSelect
          options={authorOptions}
          onValueChange={(value) => {
            setField('authors', value);
          }}
          defaultValue={authorsFromStorage || []}
          placeholder="Select authors..."
          searchable={true}
          className="w-full max-w-[300px]"
          maxCount={3}
        />
      )}
      <ErrorMessage message={errors.authors} />
    </div>
  );
};

export default AuthorMultipleSelect;
