'use client';

import { IPost, ITag, IUser } from '@/models';
import { useEffect } from 'react';
import PostEditor from '../editor';
import { usePostStorage } from '../editor/store/use-post-storage';

type EditPostFeatureProps = {
  post: Omit<IPost, 'tags' | 'authors'> & { tags: ITag[]; authors: IUser[] };
};

const EditPostFeature = ({ post }: EditPostFeatureProps) => {
  const { setInitialState } = usePostStorage();

  useEffect(() => {
    if (post) {
      setInitialState(post);
    }
  }, [post, setInitialState]);

  if (!post) return null;
  return <PostEditor mode="edit" />;
};

export default EditPostFeature;
