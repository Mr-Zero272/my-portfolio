'use client';

import { postApi } from '@/apis/post';
import { type IPost } from '@/models';
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
import { useMutation, useQuery } from '@tanstack/react-query';
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
import { Types } from 'mongoose';
import React, { useEffect, useMemo } from 'react';
import { z } from 'zod';

// Lucide Icons
import {
  CheckIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  EllipsisVerticalIcon,
  Eye,
  GripVertical,
  LayoutGrid,
  Loader2Icon,
  LoaderIcon,
  Plus,
  Trash2,
} from 'lucide-react';

// UI Components
import ConfirmDialog from '@/components/shared/confirm-dialog';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';
import { toast } from 'sonner';

// Schema for Post table data
export const postSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  published: z.boolean(),
  likes: z.number(),
  tags: z.array(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type PostType = z.infer<typeof postSchema>;

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

function DraggableRow({ row }: { row: Row<PostType> }) {
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

export function PostTable() {
  const [data, setData] = React.useState<PostType[]>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [tab, setTab] = React.useState<'posts' | 'drafts' | 'published'>('posts');
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [deleteState, setDeleteState] = React.useState<{ isOpen: boolean; postId: string | null }>({
    isOpen: false,
    postId: null,
  });

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Fetch posts using React Query
  const {
    data: postsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts', { pagination, tab }],
    queryFn: () =>
      postApi.getPosts({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: tab === 'posts' ? undefined : tab,
      }),
  });

  // delete post
  const { mutateAsync: deletePost, isPending: isDeleteingPost } = useMutation({
    mutationFn: postApi.deletePost,
  });

  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ['post-stats-by-status'],
    queryFn: () => postApi.getPostStatsByStatus(),
  });

  // Update local data when API response changes
  useEffect(() => {
    if (postsResponse?.data) {
      // Transform IPost to PostType
      const transformedData = postsResponse.data.map((post: IPost) => ({
        _id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        published: post.published,
        likes: post.likes,
        tags: post.tags?.map((tag: Types.ObjectId) => tag.toString()),
        createdAt: post.createdAt.toString(),
        updatedAt: post.updatedAt.toString(),
      }));
      setData(transformedData);
    }
  }, [postsResponse]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map((post) => post._id) || [], [data]);

  const columns: ColumnDef<PostType>[] = useMemo(
    () => [
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
        accessorKey: 'title',
        header: () => <div className="min-w-80">Title</div>,
        cell: ({ row }) => {
          return <PostCellViewer post={row.original} />;
        },
        enableHiding: false,
      },
      {
        accessorKey: 'published',
        header: () => <div className="min-w-10">Status</div>,
        cell: ({ row }) => (
          <Badge variant={row.original.published ? 'default' : 'secondary'} className="px-1.5">
            {row.original.published ? (
              <>
                <CheckIcon className="mr-1 h-3 w-3 text-white dark:text-white" />
                Published
              </>
            ) : (
              <>
                <LoaderIcon className="mr-1 h-3 w-3" />
                Draft
              </>
            )}
          </Badge>
        ),
      },
      {
        accessorKey: 'likes',
        header: () => <div className="w-full text-right">Likes</div>,
        cell: ({ row }) => <div className="text-right font-medium">{row.original.likes}</div>,
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
          const post = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                  size="icon"
                >
                  <EllipsisVerticalIcon />
                  <span className="sr-only">Open menu for {post.title}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <Link href={`/posts/${post.slug}`}>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteState({ isOpen: true, postId: post._id })}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

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
    pageCount: postsResponse?.pagination.totalPages || 0,
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
          <p className="text-muted-foreground mb-4">Failed to load posts</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={(tab) => setTab(tab as 'posts' | 'drafts' | 'published')}
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <TabsList className="">
            <TabsTrigger value="posts">All Posts</TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts <Badge variant="secondary">{statsResponse?.data?.unpublished || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="published">
              Published <Badge variant="secondary">{statsResponse?.data?.published || 0}</Badge>
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
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
            <Link href="/posts/create">
              <AnimatedButton variant="outline" size="sm">
                <Plus />
                <span className="hidden lg:inline">New Post</span>
              </AnimatedButton>
            </Link>
          </div>
        </div>
        <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
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
                          <p className="text-muted-foreground mt-2">Loading posts...</p>
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => <DraggableRow key={row.id} row={row} />)
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No posts found.
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
              {postsResponse && <span className="ml-4">Total: {postsResponse.pagination.total} posts</span>}
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
        </div>
        {/* <TabsContent value="drafts" className="flex flex-col px-4 lg:px-6">
          <div className="flex aspect-video w-full flex-1 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">Draft posts view - Coming soon</p>
          </div>
        </TabsContent>
        <TabsContent value="published" className="flex flex-col px-4 lg:px-6">
          <div className="flex aspect-video w-full flex-1 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">Published posts view - Coming soon</p>
          </div>
        </TabsContent> */}
      </Tabs>
      <ConfirmDialog
        open={deleteState.isOpen}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isHandling={isDeleteingPost}
        onOpenChange={(open) => setDeleteState({ ...deleteState, isOpen: open })}
        onCancel={() => setDeleteState({ ...deleteState, isOpen: false })}
        onConfirm={async () => {
          try {
            if (deleteState.postId) {
              await deletePost({ postId: deleteState.postId });
              setDeleteState({ isOpen: false, postId: null });
              refetch();
            }
            toast.success('Post deleted successfully');
          } catch (error) {
            console.error(error);
            toast.error('Failed to delete post. Please try again.');
          }
        }}
      />
    </>
  );
}

function PostCellViewer({ post }: { post: PostType }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {post.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{post.title}</DrawerTitle>
          <DrawerDescription>Post details and quick actions</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Status</Label>
                <p className="font-medium">{post.published ? 'Published' : 'Draft'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Likes</Label>
                <p className="font-medium">{post.likes}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Slug</Label>
              <p className="font-medium">{post.slug}</p>
            </div>
            {post.excerpt && (
              <div>
                <Label className="text-muted-foreground text-xs">Excerpt</Label>
                <p className="text-sm">{post.excerpt}</p>
              </div>
            )}
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Created</Label>
                <p className="text-sm">{format(new Date(post.createdAt), 'PPP')}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Updated</Label>
                <p className="text-sm">{format(new Date(post.updatedAt), 'PPP')}</p>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Link href={`/posts/${post.slug}`} className="w-full flex-1">
            <Button className="w-full">Edit Post</Button>
          </Link>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default PostTable;
