'use client';

import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/features/tiptap-editor'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const EditorClient = () => {
  return (
    <>
      <Editor />
    </>
  );
};

export default EditorClient;
