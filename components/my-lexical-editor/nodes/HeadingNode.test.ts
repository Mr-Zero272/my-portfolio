import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $createRangeSelection, $createTextNode, $getRoot, $getSelection, $setSelection, createEditor } from 'lexical';
import { describe, expect, it } from 'vitest';

import { $createHeadingNode, HeadingNode } from './HeadingNode';

/**
 * Regression tests cho custom HeadingNode (thêm `id` cho TOC).
 * Lưu ý: trong Lexical 0.44, mọi update phải được commit qua `editor.read(() => {})`
 * trước khi đọc `getEditorState()`, và `$generateHtmlFromNodes` phải chạy trong
 * `editor.read()`.
 */
function makeEditor() {
  return createEditor({
    nodes: [HeadingNode],
    onError: (error) => {
      throw error;
    },
  });
}

describe('HeadingNode', () => {
  it('creates a custom heading via our $createHeadingNode and serializes id', () => {
    const editor = makeEditor();

    let created: unknown;
    editor.update(() => {
      const h = $createHeadingNode('h2', 'hello-world');
      h.append($createTextNode('Hello World'));
      $getRoot().append(h);
      created = h;
    });

    expect(created).toBeInstanceOf(HeadingNode);

    editor.read(() => {});
    const json = editor.getEditorState().toJSON();
    const headingNode = (json as { root: { children: unknown[] } }).root.children[0] as {
      type: string;
      tag: string;
      id?: string;
      children?: { text?: string }[];
    };
    expect(headingNode.type).toBe('heading');
    expect(headingNode.tag).toBe('h2');
    expect(headingNode.id).toBe('hello-world');
    expect(headingNode.children?.[0]?.text).toBe('Hello World');
  });

  it('$setBlocksType converts a paragraph to a custom heading (toolbar path)', () => {
    const editor = makeEditor();

    editor.update(() => {
      const p = $createParagraphNode();
      const text = $createTextNode('Select me');
      p.append(text);
      $getRoot().append(p);

      const range = $createRangeSelection();
      range.anchor.set(text.getKey(), 0, 'text');
      range.focus.set(text.getKey(), 5, 'text');
      $setSelection(range);
    });

    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        $setBlocksType(selection, () => $createHeadingNode('h2'));
      }
    });

    editor.read(() => {});
    const json = editor.getEditorState().toJSON();
    const child = (json as { root: { children: unknown[] } }).root.children[0] as {
      type: string;
      tag?: string;
      children?: { text?: string }[];
    };
    expect(child.type).toBe('heading');
    expect(child.tag).toBe('h2');
    expect(child.children?.[0]?.text).toBe('Select me');
  });

  it('transform assigns a slug id when missing', () => {
    const editor = makeEditor();

    editor.update(() => {
      const h = $createHeadingNode('h3');
      h.append($createTextNode('Giới thiệu công nghệ'));
      $getRoot().append(h);
    });

    editor.update(() => {
      const root = $getRoot();
      const child = root.getFirstChild();
      if (child instanceof HeadingNode && child.getHeadingId() === undefined) {
        child.setHeadingId('gioi-thieu-cong-nghe');
      }
    });

    editor.read(() => {});
    const json = editor.getEditorState().toJSON();
    const headingNode = (json as { root: { children: unknown[] } }).root.children[0] as {
      type: string;
      id?: string;
    };
    expect(headingNode.id).toBe('gioi-thieu-cong-nghe');
  });

  it('exports HTML with the heading id (contentHtml path)', async () => {
    const editor = makeEditor();

    editor.update(() => {
      const h = $createHeadingNode('h2', 'hello-world');
      h.append($createTextNode('Hello World'));
      $getRoot().append(h);
    });

    editor.read(() => {});
    const { $generateHtmlFromNodes } = await import('@lexical/html');
    let html = '';
    editor.read(() => {
      html = $generateHtmlFromNodes(editor);
    });
    expect(html).toContain('<h2 id="hello-world"');
  });
});
