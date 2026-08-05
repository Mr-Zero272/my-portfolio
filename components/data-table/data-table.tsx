import { arrayMove } from '@dnd-kit/sortable';
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import { GripVertical } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import * as React from 'react';
import { useDebounceCallback } from 'usehooks-ts';

import { DataTableCardsGrid } from '@/components/data-table/data-table-cards-grid';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from '@/components/ui/sortable';
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
  enableDragColumn?: boolean;
  dragColumnDebounceMs?: number;
  onDragColumnChange?: (columnOrder: string[]) => void;
  onDragColumnCommit?: (columnOrder: string[]) => Promise<void> | void;
  disableColumnRollback?: boolean;
  enableDragRow?: boolean;
  onDragRowChange?: (params: {
    rowOrder: string[];
    activeId: string;
    overId: string;
    activeIndex: number;
    overIndex: number;
  }) => void;
}

export function DataTable<TData>({
  table,
  actionBar,
  enableDragColumn = false,
  dragColumnDebounceMs = 700,
  onDragColumnChange,
  onDragColumnCommit,
  disableColumnRollback = false,
  enableDragRow = false,
  onDragRowChange,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const [layout] = useQueryState('layout', parseAsString.withDefault('table'));
  const latestColumnCommitTokenRef = React.useRef(0);

  const commitColumnOrder = React.useCallback(
    async ({
      token,
      nextColumnOrder,
      previousColumnOrder,
    }: {
      token: number;
      nextColumnOrder: string[];
      previousColumnOrder: string[];
    }) => {
      const commit = onDragColumnCommit ?? onDragColumnChange;
      if (!commit) return;

      try {
        await Promise.resolve(commit(nextColumnOrder));
      } catch {
        if (disableColumnRollback) return;
        if (latestColumnCommitTokenRef.current !== token) return;
        table.setColumnOrder(previousColumnOrder);
      }
    },
    [onDragColumnCommit, onDragColumnChange, disableColumnRollback, table],
  );

  const debouncedColumnCommit = useDebounceCallback(commitColumnOrder, dragColumnDebounceMs);

  const visibleColumnOrder = table
    .getVisibleLeafColumns()
    .filter((column) => !column.getIsPinned())
    .map((column) => column.id);

  const onColumnDragMove = React.useCallback(
    ({ activeIndex, overIndex }: { activeIndex: number; overIndex: number }) => {
      const previousColumnOrder = table.getAllLeafColumns().map((column) => column.id);
      const nextVisibleOrder = arrayMove(visibleColumnOrder, activeIndex, overIndex);
      const draggableColumnSet = new Set(visibleColumnOrder);
      let nextVisibleIndex = 0;
      const nextColumnOrder = previousColumnOrder.map((columnId) => {
        if (!draggableColumnSet.has(columnId)) return columnId;
        const nextColumnId = nextVisibleOrder[nextVisibleIndex];
        nextVisibleIndex += 1;
        return nextColumnId;
      });

      table.setColumnOrder(nextColumnOrder);

      const token = latestColumnCommitTokenRef.current + 1;
      latestColumnCommitTokenRef.current = token;

      debouncedColumnCommit({
        token,
        nextColumnOrder,
        previousColumnOrder,
      });
    },
    [visibleColumnOrder, table, debouncedColumnCommit],
  );

  const rows = table.getRowModel().rows;
  const rowIds = rows.map((row) => row.id);

  const onRowDragMove = ({
    activeIndex,
    overIndex,
  }: {
    activeIndex: number;
    overIndex: number;
  }) => {
    const nextRowOrder = arrayMove(rowIds, activeIndex, overIndex);
    const activeId = rowIds[activeIndex];
    const overId = rowIds[overIndex];

    if (!activeId || !overId) return;

    onDragRowChange?.({
      rowOrder: nextRowOrder,
      activeId,
      overId,
      activeIndex,
      overIndex,
    });
  };

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
                  {enableDragRow ? <TableHead className="w-10" /> : null}
                  {enableDragColumn ? (
                    <Sortable
                      orientation="horizontal"
                      value={visibleColumnOrder}
                      onMove={onColumnDragMove}
                    >
                      <SortableContent withoutSlot>
                        {headerGroup.headers.map((header) => {
                          const isDraggable =
                            !header.isPlaceholder &&
                            header.column.columns.length === 0 &&
                            !header.column.getIsPinned() &&
                            visibleColumnOrder.includes(header.column.id);

                          if (!isDraggable) {
                            return (
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
                            );
                          }

                          return (
                            <SortableItem key={header.id} value={header.column.id} asChild>
                              <TableHead
                                colSpan={header.colSpan}
                                style={{
                                  ...getColumnPinningStyle({ column: header.column }),
                                }}
                                className="cursor-grab active:cursor-grabbing"
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </TableHead>
                            </SortableItem>
                          );
                        })}
                      </SortableContent>
                    </Sortable>
                  ) : (
                    headerGroup.headers.map((header) => (
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
                    ))
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows?.length ? (
                enableDragRow ? (
                  <Sortable value={rowIds} onMove={onRowDragMove}>
                    <SortableContent withoutSlot>
                      {rows.map((row) => (
                        <SortableItem key={row.id} value={row.id} asChild>
                          <TableRow data-state={row.getIsSelected() && 'selected'}>
                            <TableCell className="w-10">
                              <SortableItemHandle asChild>
                                <button
                                  type="button"
                                  aria-label="Drag row"
                                  className="text-muted-foreground hover:text-foreground size-7 flex items-center justify-center rounded-md"
                                >
                                  <GripVertical className="size-4" />
                                </button>
                              </SortableItemHandle>
                            </TableCell>
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
                        </SortableItem>
                      ))}
                    </SortableContent>
                  </Sortable>
                ) : (
                  rows.map((row) => (
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
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length + (enableDragRow ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    <StateUI
                      variant="empty"
                      title="No results"
                      description="There is no data to display. Try adjusting your filters or adding new data."
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
