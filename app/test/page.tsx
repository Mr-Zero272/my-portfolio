'use client';

import GhostLikeEditor from '@/components/my-lexical-editor/GhostLikeEditor';
import { useState } from 'react';

const TestPage = () => {
  const [content, setContent] = useState('');
  return (
    <div className="mt-20 space-y-5">
      <h1 className="text-lg font-bold">Test page</h1>
      <div className="relative mx-auto max-w-7xl space-y-4">
        <GhostLikeEditor
          initialContent={content}
          onChange={(json, html) => {
            setContent(json);
          }}
        />
        <div className="mt-4">{content}</div>
      </div>
    </div>
  );
};

export default TestPage;
