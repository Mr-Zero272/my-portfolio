'use client';

import { IPost, ITag } from '@/models';
import { useEffect } from 'react';
import PostEditor from '../editor';
import { usePostStorage } from '../editor/store/use-post-storage';

type EditPostFeatureProps = {
  post: IPost & { tags: ITag[] };
};

const EditPostFeature = ({ post }: EditPostFeatureProps) => {
  const { setInitialState } = usePostStorage();

  useEffect(() => {
    if (post) {
      setInitialState(post);
    }
  }, [post, setInitialState]);

  if (!post) return null;
  return (
    <div>
      <PostEditor mode="edit" />
    </div>
  );
};

export default EditPostFeature;
