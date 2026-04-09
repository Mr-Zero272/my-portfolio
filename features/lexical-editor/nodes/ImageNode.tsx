import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { DecoratorNode } from 'lexical';
import * as React from 'react';

// ─── Serialized shape ─────────────────────────────────────────────────────────

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    caption: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

// ─── Image component ──────────────────────────────────────────────────────────

function ImageComponent({
  src,
  altText,
  caption,
}: {
  src: string;
  altText: string;
  caption: string;
  nodeKey: NodeKey;
}) {
  return (
    <figure className="lex-image-figure" style={{ margin: '1rem 0' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={altText}
        className="lex-image"
        style={{ maxWidth: '100%', borderRadius: 6 }}
        draggable={false}
      />
      {caption && (
        <figcaption
          style={{
            textAlign: 'center',
            fontSize: '0.8rem',
            marginTop: '0.35rem',
            opacity: 0.6,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── Node definition ──────────────────────────────────────────────────────────

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;
  __altText: string;
  __caption: string;
  __width?: number;
  __height?: number;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__caption, node.__width, node.__height, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText, caption, width, height } = serializedNode;
    return new ImageNode(src, altText, caption, width, height);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(src: string, altText: string, caption: string = '', width?: number, height?: number, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__caption = caption;
    this.__width = width;
    this.__height = height;
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      altText: this.__altText,
      caption: this.__caption,
      width: this.__width,
      height: this.__height,
      type: 'image',
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__altText;
    if (this.__width) img.width = this.__width;
    if (this.__height) img.height = this.__height;
    figure.appendChild(img);
    if (this.__caption) {
      const cap = document.createElement('figcaption');
      cap.textContent = this.__caption;
      figure.appendChild(cap);
    }
    return { element: figure };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  getCaption(): string {
    return this.__caption;
  }

  setSrc(src: string): void {
    const writable = this.getWritable();
    writable.__src = src;
  }

  setCaption(caption: string): void {
    const writable = this.getWritable();
    writable.__caption = caption;
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): React.JSX.Element {
    return <ImageComponent src={this.__src} altText={this.__altText} caption={this.__caption} nodeKey={this.__key} />;
  }

  isInline(): false {
    return false;
  }

  isIsolated(): false {
    return false;
  }
}

// ─── DOM conversion helper ────────────────────────────────────────────────────

function convertImageElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLImageElement)) return null;
  const { src, alt } = domNode;
  if (!src || src.startsWith('data:')) return null;

  const figure = domNode.closest('figure');
  const caption = figure?.querySelector('figcaption')?.textContent ?? '';

  const node = new ImageNode(src, alt ?? '', caption);
  return { node };
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function $createImageNode(
  src: string,
  altText: string = '',
  caption: string = '',
  width?: number,
  height?: number,
): ImageNode {
  return new ImageNode(src, altText, caption, width, height);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
