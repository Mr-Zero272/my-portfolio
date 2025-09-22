import { IPost, ITag } from '@/models';
import PostCard from './post-card';

interface TopPostsProps {
  posts: Array<Omit<IPost, 'tags'> & { tags: ITag[] }>;
}

const TopPosts = ({ posts }: TopPostsProps) => {
  if (!posts) return null;
  const firstPost = posts[0];
  return (
    <div className="space-y-5 px-10">
      <PostCard isMainPost isDisplayExcerpt post={firstPost} />
      <div className="grid grid-cols-2 gap-4">
        {posts.slice(1, 3).map((post) => (
          <PostCard key={post._id.toString()} isDisplayExcerpt post={post} />
        ))}
      </div>
    </div>
  );
};

export default TopPosts;
