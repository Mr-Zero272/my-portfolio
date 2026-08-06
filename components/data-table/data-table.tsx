import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import { parseAsString, useQueryState } from 'nuqs';
import type * as React from 'react';

import {
  type DataTableCardRenderer,
  DataTableCardsGrid,
} from '@/components/data-table/data-table-cards-grid';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getColumnPinningStyle } from '@/lib/data-table';
import { cn } from '@/lib/utils';

import StateUI from '../shared/state-ui';

export type DataTableLayout = 'table' | 'cards';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  layout?: DataTableLayout;
  renderCard?: DataTableCardRenderer<TData>;
  cardGridClassName?: string;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  layout,
  renderCard,
  cardGridClassName,
  className,

  ...props
}: DataTableProps<TData>) {
  const [queryLayout] = useQueryState('layout', parseAsString.withDefault('table'));

  const currentLayout: DataTableLayout = layout ?? (queryLayout === 'cards' ? 'cards' : 'table');
  console.log({
    queryLayout,
    currentLayout,
  });

  return (
    <div className={cn('flex w-full flex-col gap-2.5', className)} {...props}>
      {children}
      {currentLayout === 'cards' ? (
        <DataTableCardsGrid table={table} renderCard={renderCard} className={cardGridClassName} />
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.headClassName}
                      style={{
                        ...getColumnPinningStyle({ column: header.column }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cell.column.columnDef.meta?.cellClassName}
                        style={{
                          ...getColumnPinningStyle({ column: cell.column }),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    <StateUI
                      variant="empty"
                      title="No data yet"
                      description="Try to adjust your search query or filters."
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
