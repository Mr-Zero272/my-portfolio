import DevelopingPage from '@/components/shared/developing-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Manage your blog posts in the dashboard',
};

const PostPage = () => {
  return <DevelopingPage />;
};

export default PostPage;
