import PostEditor from '@/features/editor';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create New Post',
    description: 'Create a new post',
}

const CreatePostPage = () => {
  return <PostEditor />;
};

export default CreatePostPage;
