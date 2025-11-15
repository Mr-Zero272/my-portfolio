'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type IImage } from '@/models';
import { Loader2, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import Masonry from 'react-masonry-css';

import { AnimatedButton } from '@/components/ui/animated-button';
import { cn } from '@/lib/utils';
import { useDebounceValue } from 'usehooks-ts';
import GallerySkeleton from './components/gallery-skeleton';
import ImageCard, { ImageCardSkeleton } from './components/image-card';
import ImagePreviewPanel from './components/image-preview-panel';
import './gallery.css';
import { useGalleryImages } from './hooks/use-gallery-images';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const GalleryFeature = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<IImage | null>(null);

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

  // Handle search - debouncing is handled automatically by useDebounce
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Search will be triggered automatically by debounced value change
  }, []);

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

  const handleImageClick = useCallback((image: IImage) => {
    setSelectedImage(image);
  }, []);

  // Show skeleton on initial loading
  if (isLoading && !data) {
    return <GallerySkeleton />;
  }

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mg-1 text-2xl font-bold">Gallery</h1>
        <p className="text-muted-foreground mb-5 text-sm">
          Explore your gallery {totalImages > 0 && `(${totalImages} images)`}
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex max-w-md gap-2">
          <Input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Main Layout */}
      <div className="mb-10 grid grid-cols-1 gap-6 transition-all duration-300 ease-in-out lg:grid-cols-4">
        {/* Left Panel - Gallery Grid */}
        <div
          className={cn('', {
            'lg:col-span-3': selectedImage,
            'lg:col-span-4': !selectedImage,
          })}
        >
          {allImages.length > 0 ? (
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
                  />
                ))}
                {isFetchingNextPage && Array.from({ length: 12 }).map((_, index) => <ImageCardSkeleton key={index} />)}
              </Masonry>

              {/* Load More Button */}
              {hasNextPage && (
                <div className="mt-8 text-center">
                  <AnimatedButton onClick={handleLoadMore} disabled={isFetchingNextPage} variant="outline">
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
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

        {/* Right Panel - Image Preview */}
        {selectedImage && (
          <div className="lg:col-span-1">
            <ImagePreviewPanel
              image={selectedImage}
              onDownload={handleDownload}
              onClose={() => setSelectedImage(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryFeature;
