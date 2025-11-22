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
    <div>
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
