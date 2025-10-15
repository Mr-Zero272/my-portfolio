import { ImageCardSkeleton } from './image-card';

const LoadMoreSkeleton = () => {
  return Array.from({ length: 12 }).map((_, index) => <ImageCardSkeleton key={index} />);
};

export default LoadMoreSkeleton;
