import ListPostFeature from '@/features/list-posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Manage your blog posts in the dashboard',
};

const PostPage = () => {
  return <ListPostFeature />;
};

export default PostPage;
