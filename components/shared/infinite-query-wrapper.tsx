// import { Button } from '@/components/ui/button';
// import { ListResponse } from '@/types';
// import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
// import { Loader2, RefreshCwIcon } from 'lucide-react';
// import { ReactNode } from 'react';
// import StateUI from './state-ui';

// interface InfiniteQueryHelpers {
//   hasNextPage: boolean;
//   isFetchingNextPage: boolean;
//   fetchNextPage: () => void;
// }

// interface InfiniteQueryWrapperProps<T> {
//   query: UseInfiniteQueryResult<InfiniteData<ListResponse<T>>, Error>;
//   children: (items: T[], helpers: InfiniteQueryHelpers) => ReactNode;
//   fallbackLoading?: ReactNode;
//   fallBackEmpty?: ReactNode;
//   fallBackError?: ReactNode;
//   nullWhenError?: boolean;
//   emptyMessage?: string;
//   emptyDescription?: string;
//   errorMessage?: string;
//   errorDescription?: string;
// }

// const InfiniteQueryWrapper = <T,>({
//   query,
//   children,
//   fallbackLoading = (
//     <div className="size-full flex items-center justify-center">
//       <Loader2 className="size-6 animate-spin" />
//     </div>
//   ),
//   fallBackEmpty,
//   fallBackError,
//   nullWhenError = false,
//   emptyMessage = 'No data',
//   emptyDescription = 'No data found',
//   errorMessage = 'An error occurred',
//   errorDescription = 'There was an error while fetching data.',
// }: InfiniteQueryWrapperProps<T>) => {
//   const {
//     isLoading,
//     isError,
//     error,
//     data,
//     hasNextPage,
//     isFetchingNextPage,
//     fetchNextPage,
//     refetch,
//   } = query;

//   if (isLoading) return fallbackLoading;

//   if (isError) {
//     if (nullWhenError) return null;
//     return (
//       fallBackError || (
//         <StateUI
//           variant="error"
//           title={errorMessage}
//           description={error?.message || errorDescription}
//           actions={
//             <Button onClick={() => refetch()}>
//               <RefreshCwIcon />
//               Refetch
//             </Button>
//           }
//           className="border-destructive border border-dashed"
//         />
//       )
//     );
//   }

//   const items = data?.pages.flatMap((page) => page.list) ?? [];

//   if (items.length === 0) {
//     return (
//       fallBackEmpty || (
//         <StateUI
//           variant="empty"
//           title={emptyMessage}
//           description={emptyDescription}
//           actions={
//             <Button onClick={() => refetch()}>
//               <RefreshCwIcon />
//               Refetch
//             </Button>
//           }
//           className="border border-dashed"
//         />
//       )
//     );
//   }

//   return (
//     <>
//       {children(items, {
//         hasNextPage: hasNextPage ?? false,
//         isFetchingNextPage,
//         fetchNextPage,
//       })}
//     </>
//   );
// };

// export type { InfiniteQueryHelpers, InfiniteQueryWrapperProps };
// export default InfiniteQueryWrapper;
