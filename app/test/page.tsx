'use client';

import RichTextEditor from '@/components/ui/rich-text-editor';
import { useState } from 'react';

const TestPage = () => {
  const [editorState, setEditorState] = useState<string>('');
  const [htmlString, setHtmlString] = useState<string>('');

  const handleChange = (jsonString: string, htmlString: string) => {
    // Lưu state dưới dạng JSON
    setEditorState(jsonString);
    setHtmlString(htmlString);
    console.log('Editor content:', jsonString);
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Rich Text Editor Demo</h1>

      <RichTextEditor
        onChange={handleChange}
        placeholder="Bắt đầu nhập nội dung..."
        disabled={false}
      />

      <div className="mt-4">
        <h2 className="mb-2 font-semibold">Preview JSON:</h2>
        <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-4 text-sm">
          {editorState || 'Chưa có nội dung'}
        </pre>
      </div>
      <div className="mt-4">
        <h2 className="mb-2 font-semibold">Preview HTML:</h2>
        <div
          className="prose dark:prose-invert max-h-60 overflow-auto rounded bg-gray-100 p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: htmlString }}
        />
      </div>
    </div>
  );
};

export default TestPage;
