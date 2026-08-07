// TODO: temp just for display current user, support pick multiple users later

'use client';

import StateWrapper from '@/components/shared/state-wrapper';
import { Badge } from '@/components/ui/badge';
import { Field, FieldLabel } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';
import { User2Icon } from 'lucide-react';

export const AuthorsInput = () => {
  const { data, isPending, error } = useSession();

  if (isPending) {
    return (
      <Badge variant="outline">
        <Skeleton className="size-4 rounded-none" />
        <Skeleton className="h-4 w-24 rounded-none" />
      </Badge>
    );
  }

  if (error) {
    return (
      <Badge variant="outline">
        <User2Icon className="size-4" />
        <span>Error when fetch session</span>
      </Badge>
    );
  }

  if (!data?.user) {
    return (
      <Badge variant="outline">
        <User2Icon className="size-4" />
        <span>Please login to continue</span>
      </Badge>
    );
  }

  return (
    <Field>
      <FieldLabel>Author</FieldLabel>
      <StateWrapper
        data={data}
        isLoading={isPending}
        error={error}
        fallbackLoading={
          <Badge variant="outline">
            <Skeleton className="size-4 rounded-none" />
            <Skeleton className="h-4 w-24 rounded-none" />
          </Badge>
        }
        fallbackEmpty={
          <Badge variant="outline">
            <User2Icon className="size-4" />
            <span>Please login to continue</span>
          </Badge>
        }
        fallbackError={
          <Badge variant="outline">
            <User2Icon className="size-4" />
            <span>Error when fetch session</span>
          </Badge>
        }
      >
        {(session) => {
          return (
            <Badge variant="outline">
              <User2Icon className="size-4" />
              <span>{session.user.name}</span>
            </Badge>
          );
        }}
      </StateWrapper>
    </Field>
  );
};
