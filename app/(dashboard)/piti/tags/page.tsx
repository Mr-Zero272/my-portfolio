import DevelopingPage from '@/components/shared/developing-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Manage tags in the dashboard',
};

const PostPage = () => {
  return (
    <div>
      <DevelopingPage />
    </div>
  );
};

export default PostPage;
