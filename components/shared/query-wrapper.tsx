import { Button } from '@/components/ui/button';
import { ListResponse } from '@/types';
import { UseQueryResult } from '@tanstack/react-query';
import { Loader2, RefreshCwIcon } from 'lucide-react';
import { ReactNode } from 'react';
import StateUI from './state-ui';

interface QueryWrapperProps<T> {
  query: UseQueryResult<T, Error>;
  emptyMessage?: string;
  emptyDescription?: string;
  errorMessage?: string;
  errorDescription?: string;
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
  emptyMessage = 'No data',
  emptyDescription = 'No data found',
  errorMessage = 'An error occurred',
  errorDescription = 'There was an error while fetching data.',
  children,
  refetchButtonWhenEmpty = true,
  refetchButtonWhenError = true,
  nullWhenError = false,
  fallbackLoading = (
    <div className="size-full flex items-center justify-center">
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
        <StateUI
          title={errorMessage || 'An error occurred'}
          description={
            errorDescription || error?.message || 'There was an error while fetching data.'
          }
          actions={
            refetchButtonWhenError ? (
              <Button onClick={() => refetch()}>
                <RefreshCwIcon />
                Refetch
              </Button>
            ) : null
          }
          className="border-destructive border border-dashed"
        />
      )
    );
  }

  if (
    !data ||
    (Array.isArray((data as unknown as ListResponse<T>)?.list) &&
      (data as unknown as ListResponse<T>)?.list.length === 0)
  ) {
    return (
      fallBackEmpty || (
        <StateUI
          title={emptyMessage}
          description={emptyDescription}
          actions={
            refetchButtonWhenEmpty ? (
              <Button onClick={() => refetch()}>
                <RefreshCwIcon />
                Refetch
              </Button>
            ) : null
          }
          className="border border-dashed"
        />
      )
    );
  }

  return <>{children(data)}</>;
};

export type { QueryWrapperProps };
export default QueryWrapper;
