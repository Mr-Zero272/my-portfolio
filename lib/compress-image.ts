import imageCompression from 'browser-image-compression';

export interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

/**
 * Compress an image file and convert it to WebP format.
 * Falls back gracefully if the browser doesn't support WebP encoding.
 */
export async function compressToWebP(file: File, opts?: CompressOptions): Promise<File> {
  const options = {
    fileType: 'image/webp' as const,
    maxSizeMB: opts?.maxSizeMB ?? 1,
    maxWidthOrHeight: opts?.maxWidthOrHeight ?? 1920,
    useWebWorker: true,
  };

  const compressed = await imageCompression(file, options);

  // Rename extension to .webp
  const originalName = file.name.replace(/\.[^.]+$/, '');
  return new File([compressed], `${originalName}.webp`, { type: 'image/webp' });
}
