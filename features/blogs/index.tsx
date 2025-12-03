import { IPost, ITag } from '@/models';
import ListPostByTag from './components/list-post-by-tag';
import TopPosts from './components/top-posts';

interface BlogFeatureProps {
  posts: Array<Omit<IPost, 'tags'> & { tags: ITag[] }>;
}

const BlogFeature = ({ posts }: BlogFeatureProps) => {
  return (
    <div className="site-container mx-auto flex flex-col gap-20 space-y-10 p-4 md:space-y-20">
      <TopPosts posts={posts} />
      <ListPostByTag />
    </div>
  );
};

export default BlogFeature;
