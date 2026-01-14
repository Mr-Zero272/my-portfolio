import { Button } from '@/components/ui/button';
import { UseQueryResult } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';
import EmptyState from './state/empty-state';
import ErrorState from './state/error-state';

interface QueryWrapperProps<T> {
  query: UseQueryResult<T, Error>;
  emptyMessage?: string;
  refetchButtonWhenEmpty?: boolean;
  refetchButtonWhenError?: boolean;
  nullWhenError?: boolean;
  children: (data: T) => ReactNode;
  fallbackLoading?: ReactNode;
  fallBackEmpty?: ReactNode;
  fallBackError?: ReactNode;
}

const QueryWrapper = <T,>({
  query,
  emptyMessage,
  children,
  refetchButtonWhenEmpty = true,
  refetchButtonWhenError = true,
  nullWhenError = false,
  fallbackLoading = (
    <div className="flex size-full items-center justify-center">
      <Loader2 className="size-6 animate-spin" />
    </div>
  ),
  fallBackEmpty,
  fallBackError,
}: QueryWrapperProps<T>) => {
  const { isLoading, isError, error, data, refetch } = query;

  if (isLoading) return fallbackLoading;

  if (isError) {
    if (nullWhenError) return null;
    return (
      fallBackError || (
        <ErrorState
          title="An error occurred"
          description={error?.message || 'There was an error while fetching data.'}
          action={refetchButtonWhenError ? <Button onClick={() => refetch()}>Refetch</Button> : null}
        />
      )
    );
  }

  if (!data) {
    return (
      fallBackEmpty || (
        <EmptyState
          title={emptyMessage}
          action={refetchButtonWhenEmpty ? <Button onClick={() => refetch()}>Refetch</Button> : null}
        />
      )
    );
  }

  return <>{children(data)}</>;
};

export type { QueryWrapperProps };
export default QueryWrapper;
