'use client';

import { motion } from 'motion/react';
import { parse as parseFont } from 'opentype.js';
import { useEffect, useId, useState } from 'react';

type SignatureBoundingBox = { x1: number; y1: number; x2: number; y2: number };

type SignaturePath = {
  toPathData: (decimalPlaces?: number) => string;
  getBoundingBox: () => SignatureBoundingBox;
};

type SignatureGlyph = {
  advanceWidth?: number;
  getPath: (x: number, y: number, fontSize: number) => SignaturePath;
};

type SignatureFont = {
  unitsPerEm: number;
  charToGlyph: (char: string) => SignatureGlyph;
};

const PATH_DELAY_STEP = 0.2;
const OPACITY_DELAY_OFFSET = 0.01;
const fontCache = new Map<string, SignatureFont>();

function getFontCacheKey(path: string): string {
  try {
    return new URL(path, window.location.origin).href;
  } catch {
    return path;
  }
}

function getPathTransition(index: number, duration: number, delay: number) {
  const pathDelay = delay + index * PATH_DELAY_STEP;

  return {
    pathLength: { delay: pathDelay, duration, ease: 'easeInOut' as const },
    opacity: { delay: pathDelay + OPACITY_DELAY_OFFSET, duration: 0.01 },
  };
}

async function loadFontFromPaths(fontPaths: string[]): Promise<SignatureFont> {
  for (const path of fontPaths) {
    try {
      const cacheKey = getFontCacheKey(path);
      const cachedFont = fontCache.get(cacheKey);
      if (cachedFont) return cachedFont;

      const response = await fetch(path);
      if (!response.ok) continue;

      const fontBuffer = await response.arrayBuffer();
      const font = parseFont(fontBuffer) as unknown as SignatureFont;
      fontCache.set(cacheKey, font);
      return font;
    } catch {
      // Try next path
    }
  }

  throw new Error(
    `Font could not be loaded from the provided path${fontPaths.length === 1 ? '' : 's'}: ${fontPaths.join(', ')}`,
  );
}

/**
 * Dựng path cho từng ký tự với baseline = 0, đồng thời gộp bounding box
 * THẬT của toàn bộ path (không phải ước lượng) để suy ra viewBox chuẩn.
 * Nhờ vậy ascender (VD: T) và descender (VD: g) luôn nằm trọn trong khung,
 * bất kể font hay fontSize là bao nhiêu.
 */
async function buildSignatureLayout({
  text,
  fontSize,
  maxStrokeWidth,
  padding = fontSize * 0.15,
}: {
  text: string;
  fontSize: number;
  maxStrokeWidth: number;
  padding?: number;
}): Promise<{ paths: string[]; viewBox: string; width: number; height: number }> {
  const font = await loadFontFromPaths(['/LastoriaBoldRegular.otf']);

  let x = 0;
  const nextPaths: string[] = [];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const char of text) {
    const glyph = font.charToGlyph(char);
    const glyphPath = glyph.getPath(x, 0, fontSize);
    nextPaths.push(glyphPath.toPathData(3));

    const bbox = glyphPath.getBoundingBox();
    minX = Math.min(minX, bbox.x1);
    minY = Math.min(minY, bbox.y1);
    maxX = Math.max(maxX, bbox.x2);
    maxY = Math.max(maxY, bbox.y2);

    const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
    x += advanceWidth * (fontSize / font.unitsPerEm);
  }

  // Cộng thêm nửa bề dày nét vẽ để chính stroke cũng không bị cắt cạnh.
  const edgePad = padding + maxStrokeWidth / 2;

  const viewMinX = minX - edgePad;
  const viewMinY = minY - edgePad;
  const width = maxX - minX + edgePad * 2;
  const height = maxY - minY + edgePad * 2;

  return {
    paths: nextPaths,
    viewBox: `${viewMinX} ${viewMinY} ${width} ${height}`,
    width,
    height,
  };
}

function renderMotionPaths({
  paths,
  stroke,
  strokeWidth,
  strokeLinecap,
  strokeLinejoin,
  duration,
  delay,
}: {
  paths: string[];
  stroke: string;
  strokeWidth: number;
  strokeLinecap: 'round' | 'butt';
  strokeLinejoin: 'round';
  duration: number;
  delay: number;
}) {
  return paths.map((d, index) => (
    <motion.path
      key={index}
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      variants={PATH_VARIANTS}
      transition={getPathTransition(index, duration, delay)}
      vectorEffect="non-scaling-stroke"
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
    />
  ));
}

const PATH_VARIANTS = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

interface SignatureProps {
  text?: string;
  color?: string;
  fontSize?: number;
  duration?: number;
  delay?: number;
  className?: string;
  inView?: boolean;
  once?: boolean;
}

export function Signature({
  text = 'Signature',
  color = '#000',
  fontSize = 14,
  duration = 1.5,
  delay = 0,
  className,
  inView = false,
  once = true,
}: SignatureProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [viewBox, setViewBox] = useState<string>(
    `0 0 ${text.length * fontSize * 0.6} ${fontSize * 2}`,
  );
  const [dimensions, setDimensions] = useState({
    width: text.length * fontSize * 0.6,
    height: fontSize * 2,
  });

  const maskStrokeWidth = fontSize * 0.22;
  const outlineStrokeWidth = 2;
  const maxStrokeWidth = Math.max(maskStrokeWidth, outlineStrokeWidth);
  const maskId = `signature-reveal-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    let isCancelled = false;

    async function loadSignatureLayout() {
      try {
        const layout = await buildSignatureLayout({
          text,
          fontSize,
          maxStrokeWidth,
        });

        if (isCancelled) return;

        setPaths(layout.paths);
        setViewBox(layout.viewBox);
        setDimensions({ width: layout.width, height: layout.height });
      } catch {
        if (isCancelled) return;
        setPaths([]);
      }
    }

    void loadSignatureLayout();

    return () => {
      isCancelled = true;
    };
  }, [text, fontSize, maxStrokeWidth]);

  return (
    <motion.svg
      key={paths.length}
      width={dimensions.width}
      height={dimensions.height}
      viewBox={viewBox}
      fill="none"
      className={className}
      initial="hidden"
      whileInView={inView ? 'visible' : undefined}
      animate={inView ? undefined : 'visible'}
      viewport={{ once }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {renderMotionPaths({
            paths,
            stroke: 'white',
            strokeWidth: maskStrokeWidth,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            duration,
            delay,
          })}
        </mask>
      </defs>

      {renderMotionPaths({
        paths,
        stroke: color,
        strokeWidth: outlineStrokeWidth,
        strokeLinecap: 'butt',
        strokeLinejoin: 'round',
        duration,
        delay,
      })}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, index) => (
          <path key={index} d={d} fill={color} />
        ))}
      </g>
    </motion.svg>
  );
}
