'use client';

import { useIntersection } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangleIcon,
  DownloadIcon,
  EyeIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  TrashIcon,
  UploadIcon,
} from 'lucide-react';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import ConfirmDialog from '@/components/shared/confirm-dialog';
import ImageCard, { ImageCardSkeleton } from '@/components/shared/image-card';
import { PageHeader } from '@/components/shared/page-header';
import StateUI from '@/components/shared/state-ui';
import { UploadAreaDialog } from '@/components/shared/upload-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Masonry, MasonryItem } from '@/components/ui/masonry';
import { Spinner } from '@/components/ui/spinner';
import { useDownloadFile } from '@/hooks/use-download-file';
import { GalleryImage } from '@/lib/generated/prisma/client';
import { uploadManager } from '@/lib/upload';
import { cn } from '@/lib/utils';
import { useUploadStore } from '@/stores/upload';

import { AttachmentFilterToolbar } from '../components/gallery-filter-toolbar';
import { GalleryImageDetailDrawer } from '../components/gallery-image-detail-drawer';
import { useDeleteGallery, useGalleryFilterParams, useInfiniteGalleries } from '../hooks';
import { galleryQueryKeys } from '../services';

// ─── Constants ──────────────────────────────────────────────────────────────

const MASONRY_COLUMN_WIDTH = 240;
const MASONRY_GAP = 16;
const MASONRY_ITEM_HEIGHT = 260;

// ─── Skeleton grid ──────────────────────────────────────────────────────────

const GalleryMasonrySkeleton = () => (
  <Masonry
    columnWidth={MASONRY_COLUMN_WIDTH}
    gap={MASONRY_GAP}
    itemHeight={MASONRY_ITEM_HEIGHT}
    style={{ height: 'auto' }}
  >
    {Array.from({ length: 8 }).map((_, index) => (
      <MasonryItem key={index}>
        <ImageCardSkeleton />
      </MasonryItem>
    ))}
  </Masonry>
);

// ─── Page content ───────────────────────────────────────────────────────────

export const GalleryImageListPageContent = () => {
  const queryClient = useQueryClient();
  const { params, onPatchParams, request, hasFilters } = useGalleryFilterParams();

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
  } = useInfiniteGalleries(request);

  const images = useMemo(() => data?.pages.flatMap((page) => page.list) ?? [], [data]);
  const total = data?.pages[0]?.meta?.pagination?.total;

  // infinite scroll: fetch the next page when the sentinel enters the viewport
  const { ref: loadMoreRef, entry } = useIntersection({
    threshold: 0,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // detail drawer
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // delete
  const [deleteImage, setDeleteImage] = useState<GalleryImage | null>(null);
  const deleteMutation = useDeleteGallery({
    onSuccess: () => {
      toast.success('Image deleted');
      setDeleteImage(null);
      setSelectedImage(null);
    },
    onError: (err) => {
      toast.error('Delete failed', { description: err.message });
    },
  });

  // download
  const { download } = useDownloadFile({
    onSuccess: () => toast.success('Download started'),
    onError: (err) => toast.error('Download failed', { description: err.message }),
  });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = useCallback(
    (image: GalleryImage) => {
      setDownloadingId(image.id);
      download(image.url, image.name).finally(() => setDownloadingId(null));
    },
    [download],
  );

  // upload → invalidate the gallery list when a task finishes
  const uploadTasksMap = useUploadStore((s) => s.tasks);
  const uploadTasks = useMemo(() => Array.from(uploadTasksMap.values()), [uploadTasksMap]);
  const processedUploadIds = useRef(new Set<string>());

  useEffect(() => {
    for (const task of uploadTasks) {
      if (task.status === 'uploaded' && !processedUploadIds.current.has(task.id)) {
        processedUploadIds.current.add(task.id);
        queryClient.invalidateQueries({ queryKey: galleryQueryKeys.lists(), exact: false });
      }
    }
  }, [uploadTasks, queryClient]);

  const [uploadOpen, setUploadOpen] = useState(false);

  const handleUpload = useCallback((files: File[]) => {
    files.forEach((file) => uploadManager.enqueue(file));
    toast.success('Upload started', {
      description: `${files.length} file${files.length > 1 ? 's' : ''} queued`,
    });
  }, []);

  // card menu
  const renderCardMenu = useCallback(
    (image: GalleryImage) => (
      <span onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                <MoreHorizontalIcon />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSelectedImage(image)}>
                <EyeIcon />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDownload(image)}
                disabled={downloadingId === image.id}
              >
                <DownloadIcon />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteImage(image)}>
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    ),
    [downloadingId, handleDownload],
  );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Galleries" subTitle="Manage your gallery images" />

      <AttachmentFilterToolbar
        params={params}
        onPatchParams={onPatchParams}
        hasFilters={hasFilters}
        rightSlot={
          <Button onClick={() => setUploadOpen(true)}>
            <UploadIcon />
            Upload
          </Button>
        }
      />

      {isLoading ? (
        <GalleryMasonrySkeleton />
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
            hasFilters
              ? 'No images match your current filters.'
              : 'Your gallery is empty. Upload your first image to get started.'
          }
          actions={
            hasFilters ? (
              <Button
                variant="outline"
                onClick={() => onPatchParams({ page: 1, search: '', mimeType: 'all-mine-types' })}
              >
                <RefreshCwIcon />
                Reset filters
              </Button>
            ) : (
              <Button onClick={() => setUploadOpen(true)}>
                <UploadIcon />
                Upload
              </Button>
            )
          }
        />
      ) : (
        <Masonry
          columnWidth={MASONRY_COLUMN_WIDTH}
          gap={MASONRY_GAP}
          itemHeight={MASONRY_ITEM_HEIGHT}
          maxColumnCount={8}
          style={{ height: 'auto' }}
          className={cn(
            'transition-opacity duration-300',
            isFetching && !isFetchingNextPage && 'opacity-60',
          )}
        >
          {images.map((image) => (
            <MasonryItem key={image.id}>
              <ImageCard
                src={image.url}
                alt={image.name}
                mineType={image.mimeType}
                mode="view"
                menu={renderCardMenu(image)}
                isDownloading={downloadingId === image.id}
                onDownload={() => handleDownload(image)}
                onClick={() => setSelectedImage(image)}
              />
            </MasonryItem>
          ))}
        </Masonry>
      )}

      {!isLoading && !error && images.length > 0 && (
        <div ref={loadMoreRef} className="flex min-h-16 items-center justify-center py-4">
          {isFetchingNextPage ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Spinner size="sm" />
              Loading more…
            </div>
          ) : !hasNextPage ? (
            <span className="text-muted-foreground text-sm">
              {total != null ? `Showing all ${total} images` : 'You reached the end of the gallery'}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">Scroll to load more</span>
          )}
        </div>
      )}

      {/* Detail drawer */}
      <GalleryImageDetailDrawer
        image={selectedImage}
        onOpenChange={(open) => {
          if (!open) setSelectedImage(null);
        }}
        isDownloading={selectedImage ? downloadingId === selectedImage.id : false}
        onDownload={handleDownload}
        onDelete={(image) => setDeleteImage(image)}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(deleteImage)}
        onOpenChange={(open) => {
          if (!open) setDeleteImage(null);
        }}
        variant="destructive"
        icon={<AlertTriangleIcon />}
        title="Delete image"
        description={
          <>
            Are you sure you want to delete{' '}
            <strong className="font-semibold">{deleteImage?.name}</strong>? This action cannot be
            undone.
          </>
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (!deleteImage) return;
          deleteMutation.mutate({ path: { id: deleteImage.id } });
        }}
      />

      {/* Upload dialog */}
      <UploadAreaDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSubmit={handleUpload}
        multiple
      />
    </div>
  );
};

export const GalleryImageListPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <PageHeader title="Galleries" subTitle="Manage your gallery images" />
          <GalleryMasonrySkeleton />
        </div>
      }
    >
      <GalleryImageListPageContent />
    </Suspense>
  );
};
