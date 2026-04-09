'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BlockMenu } from '../components/BlockMenu';

// ─── Command ──────────────────────────────────────────────────────────────────

export const OPEN_BLOCK_MENU_COMMAND: LexicalCommand<{
  anchorRect: DOMRect;
  initialQuery?: string;
}> = createCommand('OPEN_BLOCK_MENU');

// ─── Plugin ───────────────────────────────────────────────────────────────────

export function BlockMenuPlugin() {
  const [editor] = useLexicalComposerContext();
  const [menuState, setMenuState] = useState<{
    anchorRect: DOMRect;
    initialQuery: string;
  } | null>(null);

  useEffect(() => {
    return editor.registerCommand(
      OPEN_BLOCK_MENU_COMMAND,
      ({ anchorRect, initialQuery = '' }) => {
        setMenuState({ anchorRect, initialQuery });
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  if (!menuState) return null;

  return createPortal(
    <BlockMenu
      anchorRect={menuState.anchorRect}
      initialQuery={menuState.initialQuery}
      onClose={() => setMenuState(null)}
    />,
    document.body,
  );
}
