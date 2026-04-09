import { $generateNodesFromDOM } from '@lexical/html';
import type { LexicalEditor } from 'lexical';
import { $getRoot, $insertNodes } from 'lexical';

/**
 * Populate the editor with an HTML string.
 * Call ONCE after the editor is mounted (e.g. in a useEffect).
 */
export function deserializeFromHtml(editor: LexicalEditor, html: string): void {
  if (!html) return;

  editor.update(() => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);
    const root = $getRoot();
    root.clear();
    $insertNodes(nodes);
  });
}
