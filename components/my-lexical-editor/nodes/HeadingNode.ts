/**
 * Custom HeadingNode — mở rộng `HeadingNode` của `@lexical/rich-text`
 * để lưu thêm field `id` (slug từ nội dung heading) vào cả Lexical JSON
 * lẫn DOM/HTML output, phục vụ Table of Contents (TOC) ở trang blog detail.
 *
 * Node được đăng ký trực tiếp trong `PlaygroundNodes` và mọi đường tạo
 * heading đều đi qua helper `$createHeadingNode` (của file này) để trả về
 * instance của class này. (Lexical 0.44 không cho `with`/`withKlass` trả về
 * subclass — constructor check `errorOnTypeKlassMismatch` sẽ throw.)
 */

import type {
    DOMConversionMap,
    EditorConfig,
    ElementFormatType,
    LexicalUpdateJSON,
    NodeKey,
    SerializedElementNode,
    Spread,
} from 'lexical';

import { HeadingNode as BaseHeadingNode, type HeadingTagType } from '@lexical/rich-text';

export type SerializedHeadingNodeWithId = Spread<
  {
    tag: HeadingTagType;
    id?: string;
  },
  SerializedElementNode
>;

/**
 * Tạo heading node của class này. KHÔNG dùng `$createHeadingNode` của
 * `@lexical/rich-text` (helper đó luôn tạo base HeadingNode, sẽ fail
 * constructor check khi registered klass là subclass này).
 */
export function $createHeadingNode(tag: HeadingTagType = 'h1', id?: string): HeadingNode {
    const node = new HeadingNode(tag);
    if (id) {
        node.setHeadingId(id);
    }
    return node;
}

export class HeadingNode extends BaseHeadingNode {
  /** @internal */
  __id?: string;

  static getType(): string {
    return 'heading';
  }

  static clone(node: HeadingNode): HeadingNode {
    return new HeadingNode(node.__tag, node.__key, node.__id);
  }

  afterCloneFrom(prevNode: this): void {
    super.afterCloneFrom(prevNode);
    this.__id = prevNode.__id;
  }

  constructor(tag: HeadingTagType = 'h1', key?: NodeKey, id?: string) {
    super(tag, key);
    this.__id = id;
  }

  getHeadingId(): string | undefined {
    return this.getLatest().__id;
  }

  setHeadingId(id?: string): this {
    const self = this.getWritable();
    self.__id = id;
    return self;
  }

  // --- View ---

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    if (this.__id) {
      element.id = this.__id;
    }
    return element;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    const updated = super.updateDOM(prevNode, dom, config);
    if (prevNode.__id !== this.__id) {
      dom.id = this.__id ?? '';
    }
    return updated;
  }

  // --- Serialization ---

  exportJSON(): SerializedHeadingNodeWithId {
    return {
      ...super.exportJSON(),
      id: this.__id,
    };
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedHeadingNodeWithId>): this {
    return super.updateFromJSON(serializedNode).setHeadingId(serializedNode.id);
  }

  static importJSON(serializedNode: SerializedHeadingNodeWithId): HeadingNode {
    return $createHeadingNode(serializedNode.tag).updateFromJSON(serializedNode);
  }

  static importDOM(): DOMConversionMap | null {
    const map: DOMConversionMap = {};
    const tags: HeadingTagType[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    for (const tag of tags) {
      map[tag] = () => ({
        conversion: (element: HTMLElement) => {
          const node = $createHeadingNode(tag, element.id || undefined);
          if (element.style && element.style.textAlign) {
            node.setFormat(element.style.textAlign as ElementFormatType);
          }
          return { node };
        },
        priority: 0,
      });
    }
    return map;
  }
}
