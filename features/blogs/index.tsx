import PostCard from './components/post-card';

const BlogFeature = () => {
  return (
    <div className="grid grid-cols-2 space-y-2">
      <PostCard className="col-span-2" isMainPost />
      <PostCard />
      <PostCard />
      <div className="col-span-2 grid grid-cols-3 gap-4">
        <PostCard variant="vertical" isDisplayExcerpt isHasHoverEffect />
        <PostCard variant="vertical" isDisplayExcerpt />
        <PostCard variant="vertical" isDisplayExcerpt />
      </div>
    </div>
  );
};

export default BlogFeature;
