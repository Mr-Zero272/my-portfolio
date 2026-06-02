'use client';

import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface DataTableCardsGridProps<TData> {
  table: TanstackTable<TData>;
}

export function DataTableCardsGrid<TData>({ table }: DataTableCardsGridProps<TData>) {
  const rows = table.getRowModel().rows;

  if (!rows?.length) {
    return (
      <div className="text-muted-foreground flex h-24 items-center justify-center rounded-md border border-dashed text-center text-sm">
        Không có dữ liệu.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => {
        // Find candidate column to act as card identifier/header number
        const idCell = row
          .getVisibleCells()
          .find((cell) =>
            ['id', 'no', 'NO', 'index', 'code', 'key'].includes(cell.column.id.toLowerCase()),
          );
        const identifier = idCell ? String(idCell.getValue() ?? '') : String(row.index + 1);

        return (
          <div
            key={row.id}
            className={cn(
              'bg-card relative flex flex-col rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md',
              row.getIsSelected() && 'border-primary ring-primary ring-1',
            )}
          >
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                {row.getCanSelect() && (
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                  />
                )}
                {identifier && (
                  <span className="text-muted-foreground text-xs font-semibold">#{identifier}</span>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-1">
              {row.getVisibleCells().map((cell) => {
                const column = cell.column;
                const columnId = column.id;

                // Skip selection column cell
                if (columnId === 'select' || columnId === 'selection') return null;
                // Skip the identifier column if it's already shown at the top
                if (idCell && columnId === idCell.column.id) return null;

                const label = column.columnDef.meta?.label ?? columnId;

                return (
                  <div
                    key={cell.id}
                    className="border-muted/20 flex items-center justify-between border-b py-1 text-sm last:border-0"
                  >
                    <span className="text-muted-foreground font-medium">{label}</span>
                    <div className="text-foreground max-w-[65%] truncate font-semibold">
                      {flexRender(column.columnDef.cell, cell.getContext())}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
