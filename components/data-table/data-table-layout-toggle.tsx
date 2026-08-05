'use client';

import * as React from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { LayoutGrid, Table } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function DataTableLayoutToggle() {
  const [layout, setLayout] = useQueryState(
    'layout',
    parseAsString.withDefault('table')
  );

  return (
    <ToggleGroup
      type="single"
      value={layout}
      onValueChange={(value) => {
        if (value) setLayout(value);
      }}
      size="sm"
      className="border rounded-lg p-0.5"
    >
      <ToggleGroupItem
        value="table"
        aria-label="Table view"
        className="gap-1.5 px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <Table className="h-4 w-4" />
        <span className="hidden sm:inline">Table</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="cards"
        aria-label="Cards view"
        className="gap-1.5 px-3 py-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Cards</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
