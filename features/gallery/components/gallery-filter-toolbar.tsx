'use client';

import { ButtonWithTooltip } from '@/components/shared/button-with-tooltip';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { cn } from '@/lib/utils';
import { SortOrder } from '@/types/api';
import {
    FileIcon,
    FunnelIcon,
    FunnelXIcon,
    ListSortDescendingIcon,
    SearchIcon,
} from 'lucide-react';
import { ReactNode } from 'react';
import { MINE_TYPE_OPTIONS } from '../constants';
import { GalleryImageFilterParams, GalleryImageSortByField } from '../types/gallery';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'createdAt:desc' },
  { label: 'Oldest', value: 'createdAt:asc' },
  { label: 'Largest', value: 'size:desc' },
  { label: 'Smallest', value: 'size:asc' },
  { label: 'Name A-Z', value: 'name:asc' },
  { label: 'Name Z-A', value: 'name:desc' },
] as const;

// components/attachment-filter-toolbar.tsx
type AttachmentFilterToolbarProps = {
  params: GalleryImageFilterParams;
  onPatchParams: (patch: Partial<GalleryImageFilterParams>) => void;
  hasFilters: boolean;
  rightSlot?: ReactNode; // nút "Add" chỉ Tab cần
  className?: string; // thêm class cho Tab
};

export const AttachmentFilterToolbar = ({
  params,
  onPatchParams,
  hasFilters,
  rightSlot,
  className,
}: AttachmentFilterToolbarProps) => {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-2', className)}>
      <InputGroup className="max-w-50">
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search attachments..."
          value={params.search}
          onChange={(e) => onPatchParams({ search: e.target.value, page: 1 })}
        />
      </InputGroup>

      <div className="flex flex-wrap items-center gap-2">
        {rightSlot}

        {/* filter */}
        <Popover>
          <PopoverTrigger
            render={<ButtonWithTooltip variant="outline" size="icon" tooltip="Filters" />}
          >
            <FunnelIcon />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-70">
            <FieldGroup>
              <Field>
                <FieldLabel>File type</FieldLabel>
                <RadioGroup
                  value={params.mimeType}
                  onValueChange={(v) => onPatchParams({ mimeType: v, page: 1 })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem id="all-mine-types" value="all-mine-types" />
                    <Label htmlFor="all-mine-types" className="flex items-center gap-2">
                      <FileIcon className="size-4" />
                      Tất cả
                    </Label>
                  </div>
                  {MINE_TYPE_OPTIONS.map((opt) => (
                    <div key={opt.value} className="flex items-center gap-3">
                      <RadioGroupItem id={opt.value} value={opt.value} />
                      <Label htmlFor={opt.value} className="flex items-center gap-2">
                        <opt.icon className="size-4" />
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </Field>
              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={() =>
                    onPatchParams({
                      page: 1,
                      search: '',
                      mimeType: 'all-mine-types',
                    })
                  }
                >
                  <FunnelXIcon />
                  Reset filters
                </Button>
              )}
            </FieldGroup>
          </PopoverContent>
        </Popover>

        {/* sort */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<ButtonWithTooltip variant="outline" size="icon" tooltip="Sort" />}
          >
            <ListSortDescendingIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              {SORT_OPTIONS.flatMap((opt) => [
                <DropdownMenuCheckboxItem
                  key={opt.value}
                  checked={opt.value === params.sortBy + ':' + params.sortOrder}
                  onSelect={() => {
                    const [sortBy, sortOrder] = opt.value.split(
                      ':',
                    ) as [GalleryImageSortByField, SortOrder];
                    onPatchParams({ sortBy, sortOrder, page: 1 });
                  }}
                >
                  {opt.label}
                </DropdownMenuCheckboxItem>,
              ])}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
