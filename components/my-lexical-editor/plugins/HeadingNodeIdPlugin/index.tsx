'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode } from '@lexical/rich-text';
import { $getRoot } from 'lexical';
import { useEffect } from 'react';

import { slugify } from '@/lib/slug';

import { HeadingNode } from '../../nodes/HeadingNode';

/**
 * Sinh id (slug từ text) cho mọi heading chưa có id.
 * Chạy trên cả nội dung cũ khi plugin được đăng ký → bài cũ sẽ tự có id
 * sau khi mở lại trong editor và save.
 */
function $getUniqueHeadingId(node: HeadingNode): string {
  const text = node.getTextContent().trim();
  const base = slugify(text) || 'heading';

  const root = $getRoot();
  const used = new Set<string>();
  for (const child of root.getChildren()) {
    if ($isHeadingNode(child)) {
      const id = (child as HeadingNode).getHeadingId();
      if (id) {
        used.add(id);
      }
    }
  }

  if (!used.has(base)) {
    return base;
  }

  let index = 2;
  while (used.has(`${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}

export function HeadingNodeIdPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(HeadingNode, (node) => {
      if (node.getHeadingId() === undefined) {
        node.setHeadingId($getUniqueHeadingId(node));
      }
    });
  }, [editor]);

  return null;
}
