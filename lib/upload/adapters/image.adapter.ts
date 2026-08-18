import { postQueryKeys } from '@/features/posts/services';
import { compressToWebP } from '@/lib/compress-image';
import { getBrowserQueryClient } from '@/lib/query-client';
import axios from 'axios';
import type { UploadAdapter } from '../adapter';
import type {
  AdapterPresignResult,
  UploadAdapterConfig,
  UploadContext,
  UploadResult,
} from '../types';

// ─── Compression Config ─────────────────────────────────────────────────────

const MAX_DIMENSION = 2048; // max width/height after resize
const WEBP_QUALITY = 0.8;

// ─── Helpers ────────────────────────────────────────────────────────────────

function toWebpFileName(name: string): string {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  return `${base}.webp`;
}

// ─── Image Adapter ──────────────────────────────────────────────────────────

/**
 * Uploads a post image into the gallery (R2) via presigned URLs.
 *
 *  - `prepare` compresses raster images to WebP (skipped for SVG/GIF or when
 *    `skipCompression` is set).
 *  - `presign` / `confirm` talk to `/api/gallery/upload/*` so the resulting
 *    record is a `GalleryImage` that a `Post` can reference via `featureImageId`.
 */
export const imageAdapter: UploadAdapter<UploadContext> = {
  async prepare(file: File, config: UploadAdapterConfig<UploadContext>): Promise<File> {
    if (config.skipCompression) return file;
    // Skip vector/animated formats (SVG, GIF) and non-images.
    if (!file.type.startsWith('image/')) return file;
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;
    try {
      return await compressToWebP(file);
    } catch {
      // Fall back to the original file if compression fails.
      return file;
    }
  },

  async presign(
    file: File,
    _config: UploadAdapterConfig<UploadContext>,
  ): Promise<AdapterPresignResult> {
    const response = await axios.post('/api/gallery/upload/presigned', {
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
    });

    const data = response.data.data;
    return {
      fileId: data.fileId,
      presignedUrl: data.uploadUrl,
      publicUrl: data.publicUrl,
      key: data.key,
      name: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
    };
  },

  uploadToStorage(
    presignedUrl: string,
    file: File,
    mimeType: string,
    onProgress?: (pct: number) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', mimeType || 'application/octet-stream');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Failed to upload to storage: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.ontimeout = () => reject(new Error('Upload timed out'));
      xhr.send(file);
    });
  },

  async confirm(
    fileId: string,
    _config: UploadAdapterConfig<UploadContext>,
    presignData: AdapterPresignResult,
  ): Promise<UploadResult> {
    const response = await axios.post('/api/gallery/upload/confirm', {
      fileId,
      key: presignData.key ?? '',
      name: presignData.name ?? 'file',
      size: presignData.size ?? 0,
      mimeType: presignData.mimeType ?? 'application/octet-stream',
    });

    const data = response.data.data;
    return {
      url: data.url,
      fileId: data.id,
    };
  },

  invalidateCache(config: UploadAdapterConfig<UploadContext>): void {
    const queryClient = getBrowserQueryClient();
    const { postId } = config.context || {};

    // Uploading creates a GalleryImage — refresh post lists (feature images may
    // reference gallery images) and the detail of the post being edited.
    queryClient.invalidateQueries({ queryKey: postQueryKeys.lists(), exact: false });
    if (postId) {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail({ path: { id: postId } }),
      });
    }
  },
};
