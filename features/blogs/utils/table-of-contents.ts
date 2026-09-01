import type { TOCItemType } from '@/components/toc-minimap';
import { slugify } from '@/lib/slug';

export interface HeadingEntry {
  /** id có sẵn trong Lexical JSON (bài mới — editor tự sinh) */
  id?: string;
  /** text của heading (gộp từ các text node con) */
  text: string;
  /** 1 (h1) → 6 (h6) */
  depth: number;
}

const HEADING_DEPTH: Record<string, number> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
};

type LexicalJsonNode = {
  type?: string;
  tag?: string;
  id?: string;
  text?: string;
  children?: LexicalJsonNode[];
};

function collectText(node: LexicalJsonNode | undefined, out: string[]): void {
  if (!node) return;
  if (typeof node.text === 'string') {
    out.push(node.text);
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      collectText(child, out);
    }
  }
}

/**
 * Parse `post.content` (Lexical JSON string) → đệ quy lọc các node
 * `type === 'heading'`, trả về danh sách `{ id?, text, depth }`.
 */
export function extractHeadingsFromLexical(contentJson: string): HeadingEntry[] {
  if (!contentJson) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(contentJson);
  } catch {
    return [];
  }

  // Lexical export JSON có dạng { root: <rootNode> }. Một số bài bị lồng
  // thêm một tầng nữa ({ root: { root: ... } }) do dữ liệu bị stringify kép.
  // Mở tầng `root` liên tục cho tới khi gặp node thật (có `type`/`children`).
  let root = parsed as LexicalJsonNode & { root?: LexicalJsonNode };
  let guard = 0;
  while (
    root &&
    typeof root === 'object' &&
    !root.type &&
    !Array.isArray(root.children) &&
    root.root &&
    typeof root.root === 'object' &&
    guard < 5
  ) {
    root = root.root;
    guard += 1;
  }

  const entries: HeadingEntry[] = [];

  const walk = (node: LexicalJsonNode | undefined): void => {
    if (!node || typeof node !== 'object') return;

    if (node.type === 'heading') {
      const textParts: string[] = [];
      collectText(node, textParts);
      const text = textParts.join('').trim();
      entries.push({
        id: typeof node.id === 'string' && node.id.length > 0 ? node.id : undefined,
        text: text || 'Untitled heading',
        depth: HEADING_DEPTH[node.tag ?? 'h2'] ?? 2,
      });
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        walk(child);
      }
    }
  };

  walk(root);
  return entries;
}

const HEADING_OPEN_TAG_PATTERN = /<h([1-6])((?:\s[^>]*)?)>/gi;

/**
 * Đảm bảo mọi `<h1..h6>` trong HTML có `id` (giữ nguyên id có sẵn của bài mới,
 * fallback slugify(text) cho bài cũ). Thuần string → chạy giống nhau ở SSR
 * và client, tránh hydration mismatch.
 */
export function injectHeadingIds(html: string, entries: HeadingEntry[] = []): string {
  if (!html) return html;

  const usedIds = new Set<string>();
  let entryIndex = 0;

  return html.replace(HEADING_OPEN_TAG_PATTERN, (match, level: string, attrs: string) => {
    const entry = entries[entryIndex];
    entryIndex += 1;

    // Bài mới: editor đã sinh id → giữ nguyên.
    if (/\bid\s*=/i.test(attrs)) {
      return match;
    }

    const baseId = entry?.id || slugify(entry?.text ?? '') || 'heading';
    let candidate = baseId;
    let index = 2;
    while (usedIds.has(candidate)) {
      candidate = `${baseId}-${index}`;
      index += 1;
    }
    usedIds.add(candidate);

    const normalizedAttrs = attrs.trim();
    return `<h${level}${normalizedAttrs ? ` ${normalizedAttrs}` : ''} id="${candidate}">`;
  });
}

export interface TocBuildResult {
  /** HTML đã đảm bảo heading có id (contentHtml do Lexical sinh ra, an toàn) */
  html: string;
  /** Items cho TOCMinimap */
  items: TOCItemType[];
}

/**
 * Build HTML + TOC items từ post. Thuần string (chạy giống nhau ở SSR và
 * client → không hydration mismatch). Lưu ý: KHÔNG dùng DOMPurify ở đây vì
 * `contentHtml` do `$generateHtmlFromNodes` sinh ra (đã escape, an toàn) và
 * DOMPurify bị lỗi module-interop khi SSR với Turbopack.
 * Nếu không có `contentHtml` thật (bài legacy chỉ có JSON) → bỏ TOC.
 */
export function buildTocFromPost(contentJson: string, contentHtml: string): TocBuildResult {
  const entries = extractHeadingsFromLexical(contentJson);
  const html = injectHeadingIds(contentHtml || contentJson || '', entries);

  const items: TOCItemType[] = entries.map((entry) => {
    const id = entry.id || slugify(entry.text) || 'heading';
    return {
      title: entry.text,
      url: `#${id}`,
      depth: entry.depth,
    };
  });

  return { html, items };
}
