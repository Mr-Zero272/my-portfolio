'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  ChevronDown,
  FileImage,
  HardDrive,
  Image as ImageIcon,
  Link,
  Loader2,
  Search,
  Upload,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useEffectEvent, useMemo, useState } from 'react';
import Masonry from 'react-masonry-css';

import ErrorState from '@/components/shared/state/error-state';
import { AnimatedButton } from '@/components/ui/animated-button';
import { formatFileSize } from '@/lib';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { useDebounceValue, useIntersectionObserver } from 'usehooks-ts';
import GallerySkeleton from './components/gallery-skeleton';
import GalleryUploadDialog from './components/gallery-upload-dialog';
import GalleryUrlUploadDialog from './components/gallery-url-upload-dialog';
import ImageCard, { ImageCardSkeleton } from './components/image-card';
import './gallery.css';
import { useGalleryImages } from './hooks/use-gallery-images';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const GalleryFeature = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
  const [isUploadUrlOpen, setIsUploadUrlOpen] = useState(false);
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px',
  });

  // Debounce search query to avoid too many API calls
  const [debouncedSearch] = useDebounceValue(searchQuery, 500);

  const { data, isLoading, isFetchingNextPage, hasNextPage, isError, error, fetchNextPage } = useGalleryImages({
    search: debouncedSearch,
  });

  // Flatten all pages data
  const allImages = useMemo(() => {
    return data?.pages.flatMap((page) => page.images) ?? [];
  }, [data]);

  const totalImages = useMemo(() => data?.pages[0]?.total ?? 0, [data]);

  // Handle load more
  const handleLoadMore = useEffectEvent(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  });

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

  useEffect(() => {
    if (isIntersecting) {
      handleLoadMore();
    }
  }, [isIntersecting]);

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8 flex flex-col space-y-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="mg-1 text-2xl font-bold">Gallery</h1>
            <p className="text-muted-foreground text-sm">
              Explore your gallery {totalImages > 0 && `(${totalImages} images)`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AnimatedButton variant="default">
                  <Upload className="h-4 w-4" />
                  Upload
                  <ChevronDown className="h-4 w-4" />
                </AnimatedButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsUploadFileOpen(true)}>
                  <ImageIcon className="h-4 w-4" />
                  Upload File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsUploadUrlOpen(true)}>
                  <Link className="h-4 w-4" />
                  Upload via URL
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <GalleryUploadDialog
              open={isUploadFileOpen}
              onOpenChange={setIsUploadFileOpen}
              onUploadComplete={() => {
                queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
              }}
            />
            <GalleryUrlUploadDialog
              open={isUploadUrlOpen}
              onOpenChange={setIsUploadUrlOpen}
              onUploadComplete={() => {
                queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
              }}
            />
          </div>
        </div>

        {/* Search Form */}
        <div className="mt-4 flex max-w-md gap-2 sm:mt-0">
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
        </div>
      </div>

      {/* Loading */}
      {isLoading && <GallerySkeleton />}

      {/* Error */}
      {!isLoading && isError && <ErrorState title="Error fetching images" description={error?.message} />}

      {/* Main Layout */}
      {!isLoading && !isError && allImages.length > 0 && (
        <div className="mb-10 max-w-full flex-1 transition-all duration-300 ease-in-out">
          <PhotoProvider
            overlayRender={({ index }) => {
              const image = allImages[index];
              if (!image) return null;
              return (
                <div className="absolute right-0 bottom-0 left-0 z-50 p-4 md:right-auto md:bottom-4 md:left-4 md:p-0">
                  <div className="space-y-2 rounded-lg bg-black/60 p-4 text-sm text-white backdrop-blur-sm md:min-w-[300px]">
                    <h3 className="mb-2 truncate text-lg font-semibold" title={image.name}>
                      {image.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-gray-300" />
                      <span className="text-gray-300">Size:</span>
                      <span className="font-medium">{formatFileSize(image.size)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-gray-300" />
                      <span className="text-gray-300">Type:</span>
                      <span className="font-medium">{image.mineType}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-300" />
                      <span className="text-gray-300">Created:</span>
                      <span className="font-medium">{format(new Date(image.createdAt), 'dd MMM, yyyy HH:mm')}</span>
                    </div>

                    {image.userCreated && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-300" />
                        <span className="text-gray-300">By:</span>
                        <span className="max-w-[200px] truncate font-medium">
                          {typeof image.userCreated === 'object' && 'name' in image.userCreated
                            ? String(image.userCreated.name)
                            : 'User'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          >
            {allImages.length > 0 ? (
              <>
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {allImages.map((image) => (
                    <PhotoView key={image._id.toString()} src={image.url}>
                      <div className="mb-6">
                        <ImageCard image={image} onDownload={handleDownload} />
                      </div>
                    </PhotoView>
                  ))}
                  {isFetchingNextPage &&
                    Array.from({ length: 12 }).map((_, index) => <ImageCardSkeleton key={index} />)}
                </Masonry>

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="mt-8 text-center" ref={loadMoreRef}>
                    <AnimatedButton disabled={isFetchingNextPage} variant="outline">
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
          </PhotoProvider>
        </div>
      )}
    </div>
  );
};

export default GalleryFeature;
