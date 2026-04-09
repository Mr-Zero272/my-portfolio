'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import type { EditorState } from 'lexical';
import { useCallback, useRef } from 'react';
import { serializeToHtml } from '../utils/serialize';

interface HtmlOnChangePluginProps {
  onChange: (html: string) => void;
  /** Debounce delay in ms. Default: 600 */
  delay?: number;
}

export function HtmlOnChangePlugin({ onChange, delay = 600 }: HtmlOnChangePluginProps) {
  const [editor] = useLexicalComposerContext();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (_state: EditorState) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const html = serializeToHtml(editor);
        onChange(html);
      }, delay);
    },
    [editor, onChange, delay],
  );

  return <OnChangePlugin onChange={handleChange} ignoreSelectionChange />;
}
