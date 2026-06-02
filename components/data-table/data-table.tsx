import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import { parseAsString, useQueryState } from 'nuqs';
import type * as React from 'react';

import { DataTableCardsGrid } from '@/components/data-table/data-table-cards-grid';
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

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  simpleNavigation?: boolean;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  simpleNavigation = false,
  className,

  ...props
}: DataTableProps<TData>) {
  const [layout] = useQueryState('layout', parseAsString.withDefault('table'));

  return (
    <div className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)} {...props}>
      {children}
      {layout === 'cards' ? (
        <DataTableCardsGrid table={table} />
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
                      title="Không có dữ liệu"
                      description="Không tìm thấy dữ liệu nào phù hợp với tiêu chí của bạn."
                      className="border-none"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} shouldShowSelectedCount={!simpleNavigation} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
