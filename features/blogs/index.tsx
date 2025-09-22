import { IPost, ITag } from '@/models';
import TopPosts from './components/top-posts';

interface BlogFeatureProps {
  posts: Array<Omit<IPost, 'tags'> & { tags: ITag[] }>;
}

const BlogFeature = ({ posts }: BlogFeatureProps) => {
  return (
    <div className="container mx-auto p-4">
      <TopPosts posts={posts} />
    </div>
  );
};

export default BlogFeature;
