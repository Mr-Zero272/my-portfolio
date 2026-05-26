import DevelopingPage from '@/components/shared/developing-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Post',
  description: 'Create a new post',
};

const CreatePostPage = () => {
  return <DevelopingPage />;
};

export default CreatePostPage;
