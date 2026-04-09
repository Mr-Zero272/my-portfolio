import { $generateHtmlFromNodes } from '@lexical/html';
import type { LexicalEditor } from 'lexical';

/**
 * Serialize the current editor state to an HTML string.
 * Must be called inside editor.getEditorState().read() or editor.update().
 */
export function serializeToHtml(editor: LexicalEditor): string {
  return editor.getEditorState().read(() => {
    return $generateHtmlFromNodes(editor, null);
  });
}
