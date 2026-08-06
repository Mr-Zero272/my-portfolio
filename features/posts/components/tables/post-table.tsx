'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableLayoutToggle } from '@/components/data-table/data-table-layout-toggle';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import StateUI from '@/components/shared/state-ui';
import StateWrapper from '@/components/shared/state-wrapper';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import { Post } from '@/lib/generated/prisma/client';
import { DataTableBaseProps } from '@/types/data-table';
import { RotateCwIcon } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { usePostColumns } from './post-columns';

const COLUMN_COUNT = 5;

type TabTableProps = DataTableBaseProps<Post>;

export const PostTableSkeleton = ({ rowCount = 10 }: { rowCount?: number }) => {
  return (
    <DataTableSkeleton
      columnCount={COLUMN_COUNT}
      rowCount={rowCount}
      filterCount={1}
      withPagination
    />
  );
};

export const PostTable = ({
  data,
  pageCount,
  isLoading,
  error,
  refetch,
  onRowClick,
  actions,
}: TabTableProps) => {
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const columns = usePostColumns({
    actions,
    onRowClick,
  });

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: 'createdAt', desc: false }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <StateWrapper
      data="post-data" // use table object
      isLoading={isLoading}
      error={error}
      fallbackLoading={<PostTableSkeleton rowCount={perPage} />}
      fallbackError={
        <StateUI
          variant="error"
          title="Unable to fetch posts."
          description="Please try again later."
          actions={
            <Button variant="outline" onClick={() => refetch()}>
              <RotateCwIcon />
              Retry
            </Button>
          }
        />
      }
    >
      {() => {
        return (
          <DataTable table={table}>
            <DataTableToolbar table={table}>
              <DataTableLayoutToggle />
            </DataTableToolbar>
          </DataTable>
        );
      }}
    </StateWrapper>
  );
};

// export const PostTable = (props: TabTableProps) => {
//   return (
//     <Suspense fallback={<TabTableSkeleton rowCount={10} />}>
//       <PostTableContent {...props} />
//     </Suspense>
//   );
// };
