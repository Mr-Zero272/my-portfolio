import { IPost, ITag } from '@/models';
import ListPostByTag from './components/list-post-by-tag';
import TopPosts from './components/top-posts';

interface BlogFeatureProps {
  posts: Array<Omit<IPost, 'tags'> & { tags: ITag[] }>;
}

const BlogFeature = ({ posts }: BlogFeatureProps) => {
  return (
    <div className="mt-8 flex flex-col gap-20 space-y-10 md:space-y-20 md:p-4">
      <TopPosts posts={posts} />
      <ListPostByTag />
    </div>
  );
};

export default BlogFeature;
