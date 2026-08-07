// ─── Types ──────────────────────────────────────────────────────────────────
export type {
    AdapterPresignResult,
    UploadAdapterConfig,
    UploadContext,
    UploadResult,
    UploadStatus,
    UploadTask
} from './types';

// ─── Adapter ────────────────────────────────────────────────────────────────
export { createUploadPipeline } from './adapter';
export type { UploadAdapter } from './adapter';

// ─── Adapters ───────────────────────────────────────────────────────────────
export { imageAdapter } from './adapters/image.adapter';

// ─── Manager ────────────────────────────────────────────────────────────────
export { uploadManager } from './upload-manager';

