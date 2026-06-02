'use client';

import { LayoutGrid, Table } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import * as React from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function DataTableLayoutToggle() {
  const [layout, setLayout] = useQueryState('layout', parseAsString.withDefault('table'));

  return (
    <ToggleGroup
      value={[layout]}
      onValueChange={(value) => {
        if (value) setLayout(value?.[0]);
      }}
      size="sm"
      className="gap-0 rounded-lg border p-0.5"
    >
      <ToggleGroupItem
        value="table"
        aria-label="Table view"
        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground gap-1.5 px-3 py-1.5"
      >
        <Table className="h-4 w-4" />
        <span className="hidden md:inline">Bảng</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="cards"
        aria-label="Cards view"
        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground gap-1.5 px-3 py-1.5"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden md:inline">Grid</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
