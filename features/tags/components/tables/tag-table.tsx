'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableLayoutToggle } from '@/components/data-table/data-table-layout-toggle';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import StateUI from '@/components/shared/state-ui';
import StateWrapper from '@/components/shared/state-wrapper';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import { useTableActionsWithOptimisticDelete } from '@/hooks/use-table-actions-with-optimistic-delete';
import { Tag } from '@/lib/generated/prisma/client';
import { SortOrder } from '@/lib/generated/prisma/internal/prismaNamespace';
import { getSortingStateParser } from '@/lib/parsers';
import { DataTableBaseProps } from '@/types/data-table';
import { RotateCwIcon } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { Suspense, useMemo } from 'react';
import { useTags } from '../../hooks';
import { tagQueryKeys } from '../../services';
import { GetTagsRequest } from '../../types';
import { useTagColumns } from './tag-columns';

const COLUMN_COUNT = 5;

type TabTableProps = DataTableBaseProps<Tag>;

const TabTableSkeleton = ({ rowCount = 10 }: { rowCount?: number }) => {
  return (
    <DataTableSkeleton
      columnCount={COLUMN_COUNT}
      rowCount={rowCount}
      filterCount={1}
      withPagination
    />
  );
};

const TagTableContent = ({ onRowClick, actions, onOptimisticDelete }: TabTableProps) => {
  const [params] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<Tag>().withDefault([]),
    name: parseAsString.withDefault(''),
  });

  const queryParams = useMemo(
    () => ({
      page: params.page,
      perPage: params.perPage,
      sortBy: params.sort?.[0]?.id ?? 'createdAt',
      sortOrder: (params.sort?.[0]?.desc ? 'desc' : 'asc') as SortOrder,
      search: params.name,
    }),
    [params],
  );

  const getRequest = useMemo(
    () =>
      ({
        query: queryParams,
      }) satisfies GetTagsRequest,
    [queryParams],
  );

  const fullActions = useTableActionsWithOptimisticDelete({
    actions,
    onOptimisticDelete,
    queryKey: tagQueryKeys.list(getRequest),
  });

  const columns = useTagColumns({
    actions: fullActions,
    onRowClick,
  });

  const { data, isLoading, error, refetch } = useTags(getRequest);

  const { table } = useDataTable({
    data: data?.list ?? [],
    columns,
    pageCount: data?.meta?.pagination?.totalPages ?? -1,
    initialState: {
      sorting: [{ id: 'createdAt', desc: false }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <StateWrapper
      data="tag-data" // use table object
      isLoading={isLoading}
      error={error}
      fallbackLoading={<TabTableSkeleton rowCount={params?.perPage ?? 10} />}
      fallbackError={
        <StateUI
          variant="error"
          title="Unable to fetch tags."
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

export const TagTable = (props: TabTableProps) => {
  return (
    <Suspense fallback={<TabTableSkeleton rowCount={10} />}>
      <TagTableContent {...props} />
    </Suspense>
  );
};
