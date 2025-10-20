import { IPost, ITag } from '@/models';
import ListPostByTag from './components/list-post-by-tag';
import TopPosts from './components/top-posts';

interface BlogFeatureProps {
  posts: Array<Omit<IPost, 'tags'> & { tags: ITag[] }>;
}

const BlogFeature = ({ posts }: BlogFeatureProps) => {
  return (
    <div className="container mx-auto flex max-w-[96rem] flex-col gap-20 p-4">
      <TopPosts posts={posts} />
      <ListPostByTag />
    </div>
  );
};

export default BlogFeature;
