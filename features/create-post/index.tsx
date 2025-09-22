'use client';

import { useEffect } from 'react';
import PostEditor from '../editor';
import { usePostStorage } from '../editor/store/use-post-storage';

const CreatePOstFeature = () => {
  const { resetState } = usePostStorage();

  useEffect(() => {
    resetState();
  }, [resetState]);

  return <PostEditor mode="create" />;
};

export default CreatePOstFeature;
