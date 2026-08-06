import { ListPostsPage } from '@/features/posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post',
  description: 'Write and share your stories',
};

const PostsPage = () => {
  return <ListPostsPage />;
};

export default PostsPage;
