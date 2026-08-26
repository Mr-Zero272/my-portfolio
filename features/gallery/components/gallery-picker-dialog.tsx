'use client';

import { ButtonWithTooltip } from '@/components/shared/button-with-tooltip';
import ImageCard, { ImageCardSkeleton } from '@/components/shared/image-card';
import StateUI from '@/components/shared/state-ui';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { GalleryImage } from '@/lib/generated/prisma/client';
import { cn } from '@/lib/utils';
import { SortOrder } from '@/types/api';
import { useIntersection } from '@mantine/hooks';
import {
  CheckIcon,
  ImageIcon,
  ListSortDescendingIcon,
  RefreshCwIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useInfiniteGalleries } from '../hooks';
import { useGalleryLocalFilterParams } from '../hooks/use-gallery-local-filter-params';
import { GalleryImageSortByField } from '../types/gallery';

// ─── Constants ──────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: 'Newest', value: 'createdAt:desc' },
  { label: 'Oldest', value: 'createdAt:asc' },
  { label: 'Largest', value: 'size:desc' },
  { label: 'Smallest', value: 'size:asc' },
  { label: 'Name A–Z', value: 'name:asc' },
  { label: 'Name Z–A', value: 'name:desc' },
] as const;

// ─── Skeleton ────────────────────────────────────────────────────────────────

const PickerSkeleton = () => (
  <ResponsiveMasonry
    columnsCountBreakPoints={{ 640: 1, 768: 2, 1024: 4, 1536: 6, 2560: 8 }}
    gutterBreakPoints={{ 640: 16, 768: 16, 1024: 16, 1536: 16, 2560: 16 }}
  >
    <Masonry>
      {Array.from({ length: 12 }).map((_, i) => (
        <ImageCardSkeleton key={i} />
      ))}
    </Masonry>
  </ResponsiveMasonry>
);

// ─── Props ───────────────────────────────────────────────────────────────────

export interface GalleryPickerDialogProps {
  /** Controls whether the dialog is open */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Called when the user confirms selection.
   * Single mode: receives the full `GalleryImage` object.
   * Multiple mode: receives an array of `GalleryImage`.
   */
  onSelect: (images: GalleryImage | GalleryImage[]) => void;
  /** Dialog heading (default: "Select Image") */
  title?: string;
  /** Multi-select mode: pick several images at once, confirm returns `GalleryImage[]`. */
  multiple?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function GalleryPickerDialog({
  open,
  onOpenChange,
  onSelect,
  title = 'Select Image',
  multiple = false,
}: GalleryPickerDialogProps) {
  // ── Local filter state (non-URL) ──────────────────────────────────────────
  const { params, onPatchParams, request, reset } = useGalleryLocalFilterParams();

  // ── Selection state ───────────────────────────────────────────────────────
  const [pendingImage, setPendingImage] = useState<GalleryImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<GalleryImage[]>([]);

  // Reset filters whenever the dialog opens
  const prevOpen = useRef(open);

  useEffect(() => {
    if (open && !prevOpen.current) {
      reset();
      setPendingImage(null);
      setSelectedImages([]);
    }
    prevOpen.current = open;
  }, [open, reset]);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
  } = useInfiniteGalleries(open ? request : undefined);

  const images = useMemo(() => data?.pages.flatMap((p) => p.list) ?? [], [data]);

  // ── Infinite scroll ───────────────────────────────────────────────────────
  const { ref: loadMoreRef, entry } = useIntersection({ threshold: 0 });
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Selection ─────────────────────────────────────────────────────────────
  const handleToggle = useCallback(
    (image: GalleryImage) => {
      if (multiple) {
        setSelectedImages((prev) =>
          prev.some((item) => item.id === image.id)
            ? prev.filter((item) => item.id !== image.id)
            : [...prev, image],
        );
      } else {
        setPendingImage((prev) => (prev?.id === image.id ? null : image));
      }
    },
    [multiple, setPendingImage, setSelectedImages],
  );

  const handleConfirm = useCallback(() => {
    if (multiple) {
      if (selectedImages.length === 0) return;
      onSelect(selectedImages);
    } else {
      if (!pendingImage) return;
      onSelect(pendingImage);
    }
    onOpenChange(false);
  }, [multiple, pendingImage, selectedImages, onSelect, onOpenChange]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const currentSort = `${params.sortBy}:${params.sortOrder}`;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex h-[90vh] max-h-225 max-w-5xl flex-col gap-0 p-0 sm:max-w-[90vw]">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <ResponsiveDialogHeader className="shrink-0 border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md">
              <ImageIcon className="size-4" />
            </div>
            <ResponsiveDialogTitle className="text-base">{title}</ResponsiveDialogTitle>
          </div>

          {/* Toolbar */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Search */}
            <InputGroup className="relative flex-1">
              <InputGroupAddon align="inline-start">
                <SearchIcon className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                id="gallery-picker-search"
                placeholder="Search images…"
                value={params.search}
                onChange={(e) => onPatchParams({ search: e.target.value })}
              />
              {params.search && (
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-2 flex items-center transition-colors"
                  onClick={() => onPatchParams({ search: '' })}
                  aria-label="Clear search"
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </InputGroup>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<ButtonWithTooltip variant="outline" size="icon" tooltip="Sort by" />}
              >
                <ListSortDescendingIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  {SORT_OPTIONS.map((opt) => (
                    <DropdownMenuCheckboxItem
                      key={opt.value}
                      checked={opt.value === currentSort}
                      onSelect={() => {
                        const [sortBy, sortOrder] = opt.value.split(':') as [
                          GalleryImageSortByField,
                          SortOrder,
                        ];
                        onPatchParams({ sortBy, sortOrder });
                      }}
                    >
                      {opt.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Refetch indicator */}
            {isFetching && !isLoading && <Spinner size="sm" className="text-muted-foreground" />}
          </div>
        </ResponsiveDialogHeader>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <PickerSkeleton />
          ) : error ? (
            <StateUI
              variant="error"
              title="Failed to load images"
              description="There was an error loading your gallery. Please try again."
              actions={
                <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              }
            />
          ) : images.length === 0 ? (
            <StateUI
              variant="empty"
              title="No images found"
              description={
                params.search ? `No images match "${params.search}".` : 'Your gallery is empty.'
              }
            />
          ) : (
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 640: 1, 768: 2, 1024: 4, 1536: 6, 2560: 8 }}
              gutterBreakPoints={{ 640: 16, 768: 16, 1024: 16, 1536: 16, 2560: 16 }}
              style={{
                transition: 'opacity 0.2s ease-in-out',
                opacity: isFetching && !isFetchingNextPage ? 0.6 : 1,
              }}
              className={cn('transition-opacity duration-200')}
            >
              <Masonry>
                {images.map((image) => {
                  const isSelected = multiple
                    ? selectedImages.some((item) => item.id === image.id)
                    : pendingImage?.id === image.id;
                  return (
                    <div className="relative" key={image.id}>
                      <ImageCard
                        src={image.url}
                        alt={image.name}
                        mineType={image.mimeType}
                        mode="select"
                        isActive={isSelected}
                        onSelect={() => handleToggle(image)}
                      />
                      {/* Selection ring */}
                      {isSelected && (
                        <div className="ring-primary pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-inset" />
                      )}
                    </div>
                  );
                })}
              </Masonry>
            </ResponsiveMasonry>
          )}

          {/* Load-more sentinel */}
          {!isLoading && !error && images.length > 0 && (
            <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center py-3">
              {isFetchingNextPage ? (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Spinner size="sm" />
                  Loading more…
                </div>
              ) : !hasNextPage ? (
                <span className="text-muted-foreground text-xs">
                  Showing all {images.length} image{images.length !== 1 ? 's' : ''}
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <ResponsiveDialogFooter className="mx-0 mb-0">
          <div className="flex w-full items-center justify-between gap-3">
            {/* Selected preview */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {multiple ? (
                selectedImages.length > 0 ? (
                  <>
                    <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      <CheckIcon className="size-3.5" />
                    </div>
                    <span className="text-muted-foreground max-w-xs truncate text-sm">
                      {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground text-sm">No image selected</span>
                )
              ) : pendingImage ? (
                <>
                  <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span className="text-muted-foreground max-w-xs truncate text-sm">
                    {pendingImage.name}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground text-sm">No image selected</span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                id="gallery-picker-confirm"
                onClick={handleConfirm}
                disabled={multiple ? selectedImages.length === 0 : !pendingImage}
              >
                {multiple ? 'Add images' : 'Select image'}
              </Button>
            </div>
          </div>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
