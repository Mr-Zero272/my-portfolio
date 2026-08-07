import type {
  AdapterPresignResult,
  UploadAdapterConfig,
  UploadContext,
  UploadResult,
} from './types';

// ─── Upload Adapter Interface ───────────────────────────────────────────────

/**
 * Strategy interface for file upload adapters.
 *
 * Each adapter encapsulates the full upload pipeline for a specific file type:
 *   prepare → presign → uploadToStorage → confirm → invalidateCache
 *
 * Implementations:
 *  - {@link ImageAdapter} — post images with optional WebP compression
 */
export interface UploadAdapter<C extends UploadContext = UploadContext> {
  /** Preprocess the file before upload (e.g., compress, rename). Return the (possibly new) file. */
  prepare(file: File, config: UploadAdapterConfig<C>): Promise<File>;

  /** Request a presigned URL from the backend. */
  presign(file: File, config: UploadAdapterConfig<C>): Promise<AdapterPresignResult>;

  /** PUT the file directly to storage (R2) via the presigned URL. Fires `onProgress` with 0-100. */
  uploadToStorage(
    presignedUrl: string,
    file: File,
    mimeType: string,
    onProgress?: (pct: number) => void,
  ): Promise<void>;

  /** Confirm the upload with the backend so the file record becomes ACTIVE. */
  confirm(
    fileId: string,
    config: UploadAdapterConfig<C>,
    presignData: AdapterPresignResult,
  ): Promise<UploadResult>;

  /** Invalidate React Query caches relevant to the entity that owns this file. */
  invalidateCache(config: UploadAdapterConfig<C>): void;
}

// ─── Pipeline Factory ───────────────────────────────────────────────────────

/**
 * Runs the full upload pipeline for a single file through the given adapter.
 *
 * Sequence: prepare → presign → uploadToStorage (with progress) → confirm → invalidateCache
 */
export async function createUploadPipeline<C extends UploadContext = UploadContext>(
  adapter: UploadAdapter<C>,
  file: File,
  config: UploadAdapterConfig<C>,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  const prepared = await adapter.prepare(file, config);
  const presignData = await adapter.presign(prepared, config);
  await adapter.uploadToStorage(presignData.presignedUrl, prepared, prepared.type, onProgress);
  const result = await adapter.confirm(presignData.fileId, config, presignData);
  adapter.invalidateCache(config);
  return result;
}
