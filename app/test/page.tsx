'use client';

import GhostLikeEditor from '@/features/my-lexical-editor/GhostLikeEditor';
import { useEffect, useState } from 'react';

const EditorClient = () => {
  const [content, setContent] = useState('');

  // Mô phỏng fetch nội dung từ API (mất 2 giây)
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialContent =
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Đây là nội dung được fetch từ API sau 2 giây! (Mode Edit)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';
      setContent(initialContent);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="">
      <h1 className="mb-4 text-xl font-bold">Uncontrolled Lexical Sync Demo</h1>
      <div className="relative">
        <GhostLikeEditor content={content} onChange={setContent} />
      </div>

      <div className="mt-10 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 font-mono text-sm font-bold text-gray-500 uppercase">Synced State (JSON):</h2>
        <pre className="overflow-auto text-xs whitespace-pre-wrap text-gray-700">
          {content || 'Waiting for initial content...'}
        </pre>
      </div>
    </div>
  );
};

export default EditorClient;
