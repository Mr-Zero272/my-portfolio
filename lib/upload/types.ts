// ─── Upload Status ──────────────────────────────────────────────────────────

export type UploadStatus = 'idle' | 'queued' | 'uploading' | 'uploaded' | 'error';

// ─── Upload Context ─────────────────────────────────────────────────────────

/**
 * Context attached to every upload task. Extend this type to carry additional
 * entity info (e.g. the post an image is being uploaded for).
 */
export interface UploadContext {
  /** The post this upload belongs to (used for cache invalidation). */
  postId?: string;
}

// ─── Upload Task ────────────────────────────────────────────────────────────

export interface UploadTask<C extends UploadContext = UploadContext> {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number; // 0-100
  error: string | null;
  retryCount: number;
  maxRetries: number;
  /** Entity context for cache invalidation after upload. */
  context: C;
  /** Whether to skip image compression (only relevant for image adapters) */
  skipCompression?: boolean;
  /** Result populated after successful upload */
  result?: UploadResult;
  /** Reference to the underlying XHR for abort-on-cancel */
  xhr?: XMLHttpRequest;
  createdAt: string;
  updatedAt?: string;
}

// ─── Upload Result ──────────────────────────────────────────────────────────

export interface UploadResult {
  url: string;
  fileId: string;
}

// ─── Adapter Config ─────────────────────────────────────────────────────────

export interface UploadAdapterConfig<C extends UploadContext = UploadContext> {
  context?: C;
  skipCompression?: boolean;
}

// ─── Adapter Presign Result ─────────────────────────────────────────────────

export interface AdapterPresignResult {
  fileId: string;
  presignedUrl: string;
  publicUrl?: string;
  key?: string;
  name?: string;
  size?: number;
  mimeType?: string;
}
