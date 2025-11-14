import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/shared/responsive-dialog';
import { AnimatedButton } from '@/components/ui/animated-button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { IImage } from '@/models';
import { LoaderIcon, Search } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useDebounceValue } from 'usehooks-ts';
import '../gallery.css';
import { useGalleryImages } from '../hooks/use-gallery-images';
import GallerySkeleton from './gallery-skeleton';
import ImageCard, { ImageCardSkeleton } from './image-card';

type GallerySelectProps = {
  value: IImage | null;
  onValueChange: (image: IImage | null) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const GallerySelect = ({ value, onValueChange, open, onOpenChange, trigger }: GallerySelectProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search query to avoid too many API calls
  const [debouncedSearch] = useDebounceValue(searchQuery, 500);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGalleryImages({
    search: debouncedSearch,
  });

  // Flatten all pages data
  const allImages = useMemo(() => {
    return data?.pages.flatMap((page) => page.images) ?? [];
  }, [data]);

  const totalImages = useMemo(() => data?.pages[0]?.total ?? 0, [data]);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDownload = useCallback(async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }, []);

  const handleImageClick = useCallback(
    (image: IImage) => {
      onValueChange(image);
    },
    [onValueChange],
  );

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>}
      <ResponsiveDialogContent className="flex h-[90vh] max-h-[900px] max-w-full flex-col sm:max-w-full">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Select Image from Gallery</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>Chose from {totalImages} images</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-5">
          {/* Search Bar */}
          <div className="flex-shrink-0">
            <InputGroup>
              <InputGroupInput
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                {isFetchingNextPage ? <LoaderIcon className="animate-spin" /> : `${totalImages} images`}
              </InputGroupAddon>
            </InputGroup>
          </div>
          {/* Scrollable Content */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {isLoading && <GallerySkeleton />}
            {!isLoading && allImages.length > 0 ? (
              <>
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {allImages.map((image) => (
                    <ImageCard
                      key={image._id.toString()}
                      image={image}
                      onImageClick={handleImageClick}
                      onDownload={handleDownload}
                      mode="select"
                      isActive={value?._id === image._id}
                    />
                  ))}
                  {isFetchingNextPage &&
                    Array.from({ length: 12 }).map((_, index) => <ImageCardSkeleton key={index} />)}
                </Masonry>

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="mt-8 text-center">
                    <AnimatedButton onClick={handleLoadMore} disabled={isFetchingNextPage} variant="outline">
                      {isFetchingNextPage ? (
                        <>
                          <LoaderIcon className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load more'
                      )}
                    </AnimatedButton>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  {searchQuery ? 'No images found.' : 'No images uploaded yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default GallerySelect;
