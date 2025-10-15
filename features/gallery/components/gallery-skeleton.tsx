import { Skeleton } from '@/components/ui/skeleton';
import Masonry from 'react-masonry-css';
import { ImageCardSkeleton } from './image-card';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const GallerySkeleton = () => {
  return (
    <div className="container mx-auto px-2 md:px-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-1 h-8 w-32" />
        <Skeleton className="mb-5 h-4 w-48" />

        {/* Search Form Skeleton */}
        <div className="flex max-w-md gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Gallery Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 transition-all duration-300 ease-in-out lg:grid-cols-4">
        {/* Left Panel - Gallery Grid */}
        <div className="lg:col-span-4">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <ImageCardSkeleton key={index} />
            ))}
          </Masonry>
        </div>
      </div>
    </div>
  );
};

export default GallerySkeleton;
