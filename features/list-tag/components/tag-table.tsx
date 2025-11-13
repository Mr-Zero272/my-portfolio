'use client';

import { tagApi } from '@/apis/tag';
import { type ITag } from '@/models';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import React from 'react';
import { z } from 'zod';

// Lucide Icons
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  EllipsisVerticalIcon,
  Eye,
  GripVertical,
  LayoutGrid,
  Loader2Icon,
  Plus,
  Trash2,
  XIcon,
} from 'lucide-react';

// UI Components
import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import TagDeleteConfirmDialog from './tag-delete-confirm-dialog';
import TagFormDialog from './tag-form-dialog';

// Schema for Tag table data
export const tagSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type TagType = z.infer<typeof tagSchema>;

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <GripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const createColumns = (
  handleEditTag: (tag: TagType) => void,
  handleDeleteTag: (tag: TagType) => void,
): ColumnDef<TagType>[] => [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original._id} />,
  },
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value: boolean | string) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean | string) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => <div className="min-w-80">Tag Name</div>,
    cell: ({ row }) => {
      return <TagCellViewer tag={row.original} onEdit={handleEditTag} onDelete={handleDeleteTag} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'slug',
    header: () => <div className="min-w-40">Slug</div>,
    cell: ({ row }) => <div className="text-muted-foreground font-mono text-sm">{row.original.slug}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="w-full text-right">Created</div>,
    cell: ({ row }) => (
      <div className="text-muted-foreground text-right text-sm">
        {format(new Date(row.original.createdAt), 'MMM dd, yyyy hh:mm a')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const tag = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <EllipsisVerticalIcon />
              <span className="sr-only">Open menu for {tag.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>
              <Eye className="h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditTag(tag)}>
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTag(tag)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DraggableRow({ row }: { row: Row<TagType> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original._id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}

interface TagTableProps {
  page?: number;
  limit?: number;
  type?: string;
}

export function TagTable({ page = 1, limit = 10, type }: TagTableProps) {
  const [data, setData] = React.useState<TagType[]>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: page - 1,
    pageSize: limit,
  });

  // Dialog state for TagFormDialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [editingTag, setEditingTag] = React.useState<ITag | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  // Dialog state for TagDeleteConfirmDialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingTag, setDeletingTag] = React.useState<ITag | null>(null);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = React.useState(false);

  // Handler functions for dialog actions
  const handleEditTag = React.useCallback((tag: TagType) => {
    // Create a simple object that matches what TagFormDialog expects
    const tagData = {
      _id: { toString: () => tag._id },
      name: tag.name,
      slug: tag.slug,
      createdAt: new Date(tag.createdAt),
      updatedAt: new Date(tag.updatedAt),
    } as unknown as ITag;
    setEditingTag(tagData);
    setIsEditDialogOpen(true);
  }, []);

  const handleCreateTag = React.useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleDeleteTag = React.useCallback((tag: TagType) => {
    // Convert TagType to ITag for delete dialog
    const tagData = {
      _id: { toString: () => tag._id },
      name: tag.name,
      slug: tag.slug,
      createdAt: new Date(tag.createdAt),
      updatedAt: new Date(tag.updatedAt),
    } as unknown as ITag;
    setDeletingTag(tagData);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleBulkDelete = React.useCallback(() => {
    setIsBulkDeleteDialogOpen(true);
  }, []);

  // Create columns with handlers
  const columns = React.useMemo(() => createColumns(handleEditTag, handleDeleteTag), [handleEditTag, handleDeleteTag]);

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Fetch tags using React Query
  const {
    data: tagsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tags', { page, limit, type }],
    queryFn: () =>
      tagApi.getTags({
        page,
        limit,
        type,
      }),
  });

  // Update local data when API response changes
  React.useEffect(() => {
    if (tagsResponse?.data) {
      // Transform ITag to TagType
      const transformedData = tagsResponse.data.map((tag: ITag) => ({
        _id: tag._id.toString(),
        name: tag.name,
        slug: tag.slug,
        createdAt: tag.createdAt.toString(),
        updatedAt: tag.updatedAt.toString(),
      }));
      setData(transformedData);
    }
  }, [tagsResponse]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map((post) => post._id) || [], [data]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row._id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    // Override pagination with server-side data
    pageCount: tagsResponse?.pagination.totalPages || 0,
    manualPagination: true,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Failed to load tags</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="tags" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList className="">
          <TabsTrigger value="tags">All Tags</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <TagDeleteConfirmDialog
              tags={table.getFilteredSelectedRowModel().rows.map((row) => {
                const tag = row.original;
                return {
                  _id: { toString: () => tag._id },
                  name: tag.name,
                  slug: tag.slug,
                  createdAt: new Date(tag.createdAt),
                  updatedAt: new Date(tag.updatedAt),
                } as unknown as ITag;
              })}
              open={isBulkDeleteDialogOpen}
              onOpenChange={setIsBulkDeleteDialogOpen}
            >
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4" />
                <span className="hidden lg:inline">Delete ({table.getFilteredSelectedRowModel().rows.length})</span>
                <span className="lg:hidden">Delete</span>
              </Button>
            </TagDeleteConfirmDialog>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <LayoutGrid />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: boolean | string) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <TagFormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <AnimatedButton variant="outline" size="sm" onClick={handleCreateTag}>
              <Plus />
              <span className="hidden lg:inline">New Tag</span>
            </AnimatedButton>
          </TagFormDialog>
        </div>
      </div>
      <TabsContent value="tags" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        <Loader2Icon className="mx-auto h-6 w-6 animate-spin" />
                        <p className="text-muted-foreground mt-2">Loading tags...</p>
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => <DraggableRow key={row.id} row={row} />)
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No tags found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
            {tagsResponse && <span className="ml-4">Total: {tagsResponse.pagination.total} tags</span>}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value: string) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Edit Tag Dialog */}
      <TagFormDialog tag={editingTag} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <div />
      </TagFormDialog>

      {/* Delete Tag Dialog */}
      <TagDeleteConfirmDialog tag={deletingTag} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <div />
      </TagDeleteConfirmDialog>
    </Tabs>
  );
}

function TagCellViewer({
  tag,
  onEdit,
  onDelete,
}: {
  tag: TagType;
  onEdit?: (tag: TagType) => void;
  onDelete?: (tag: TagType) => void;
}) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {tag.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{tag.name}</DrawerTitle>
          <DrawerDescription>Tag details and quick actions</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="grid gap-2">
            <div>
              <Label className="text-muted-foreground text-xs">Slug</Label>
              <p className="font-mono font-medium">{tag.slug}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Created</Label>
                <p className="text-sm">{format(new Date(tag.createdAt), 'PPP')}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Updated</Label>
                <p className="text-sm">{format(new Date(tag.updatedAt), 'PPP')}</p>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex flex-row items-center gap-2">
          <Button onClick={() => onEdit?.(tag)} className="flex-1">
            <Edit className="h-4 w-4" />
            Edit Tag
          </Button>
          <Button variant="destructive" onClick={() => onDelete?.(tag)} className="flex-1">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="flex-1">
              <XIcon className="h-4 w-4" />
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default TagTable;
