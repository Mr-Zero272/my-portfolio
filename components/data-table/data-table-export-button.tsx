'use client';

import type { Table } from '@tanstack/react-table';
import { CellValue } from 'hucre';
import { writeCsvObjects } from 'hucre/csv';
import { writeXlsx } from 'hucre/xlsx';
import { DownloadIcon, FileChartColumnIcon, FileSpreadsheetIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Spinner } from '../ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface DataTableExportButtonProps<TData> {
  table: Table<TData>;
  filename?: string;
  sheetName?: string;
}

type ExportFormat = 'xlsx' | 'csv';

export function DataTableExportButton<TData>({
  table,
  filename = 'export',
  sheetName = 'Sheet1',
}: DataTableExportButtonProps<TData>) {
  const [isExporting, setIsExporting] = useState(false);

  function getExportData() {
    const visibleColumns = table
      .getVisibleLeafColumns()
      .filter((col) => col.id !== 'actions' && col.id !== 'select');

    const rows = table.getFilteredRowModel().rows;

    return { visibleColumns, rows };
  }

  async function handleExport(format: ExportFormat) {
    setIsExporting(true);
    try {
      const { visibleColumns, rows } = getExportData();

      const data = rows.map((row) => {
        const record: Record<string, unknown> = {};
        for (const col of visibleColumns) {
          const label = (col.columnDef.meta as { label?: string } | undefined)?.label ?? col.id;
          const value = row.getValue(col.id);
          record[label] = value instanceof Date ? value : (value ?? '');
        }
        return record;
      });

      let blob: Blob;

      if (format === 'xlsx') {
        const hucreColumns = visibleColumns.map((col) => ({
          header: (col.columnDef.meta as { label?: string } | undefined)?.label ?? col.id,
          key: (col.columnDef.meta as { label?: string } | undefined)?.label ?? col.id,
          autoWidth: true,
        }));

        const buffer = await writeXlsx({
          sheets: [
            {
              name: sheetName,
              columns: hucreColumns,
              data: data as Record<string, CellValue>[],
              freezePane: { rows: 1 },
            },
          ],
        });

        blob = new Blob([buffer as BlobPart], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
      } else {
        const csv = writeCsvObjects(data as Record<string, CellValue>[], {
          bom: true, // giúp Excel mở UTF-8 không bị lỗi tiếng Việt
        });

        blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      }

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${filename}.${format}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" disabled={isExporting} aria-label="Export data">
                  {isExporting ? <Spinner /> : <DownloadIcon />}
                  <span className="hidden md:inline"> {isExporting ? 'Đang xuất...' : 'Xuất'}</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                <FileSpreadsheetIcon />
                Xuất Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileChartColumnIcon />
                Xuất CSV (.csv)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <TooltipContent className="max-w-40">
        <p>Chọn định dạng xuất file</p>
      </TooltipContent>
    </Tooltip>
  );
}
