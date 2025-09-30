import ListTagFeature from '@/features/list-tag';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Manage tags in the dashboard',
};

const PostPage = () => {
  return (
    <div>
      <ListTagFeature />
    </div>
  );
};

export default PostPage;
