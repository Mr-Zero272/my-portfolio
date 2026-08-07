import { generateId } from '@/lib/id';
import { useUploadStore } from '@/stores/upload';
import { createUploadPipeline, type UploadAdapter } from './adapter';
import { imageAdapter } from './adapters/image.adapter';
import type { UploadAdapterConfig, UploadTask } from './types';

// ─── Retry Config ───────────────────────────────────────────────────────────

const MAX_CONCURRENCY = 2;
const MAX_AUTO_RETRIES = 1;
const RETRY_BASE_DELAY_MS = 1000; // exponential: 1s, 2s

// ─── UploadManager ──────────────────────────────────────────────────────────

/**
 * Singleton queue manager for file uploads.
 *
 * Responsibilities:
 *  - Maintains an in-memory queue of task IDs
 *  - Processes up to {@link MAX_CONCURRENCY} tasks simultaneously
 *  - Auto-retries failed tasks with exponential backoff (2 attempts)
 *  - After max auto-retries, sets status to `'error'` for manual retry
 *  - Updates the {@link useUploadStore} on every state transition
 *  - Supports cancellation via AbortController stored on each task
 *  - Uses the adapter set via {@link UploadManager.setAdapter}, falling back
 *    to the default {@link imageAdapter} (post image uploads)
 *
 * Usage:
 *  ```ts
 *  uploadManager.enqueue(file, { context: { postId: '123' } });
 *  ```
 */
class UploadManager {
  private concurrency = MAX_CONCURRENCY;
  private activeCount = 0;
  private queue: string[] = [];
  private adapter?: UploadAdapter;

  constructor(adapter?: UploadAdapter) {
    this.adapter = adapter;
  }

  // ── Public API ──────────────────────────────────────────────────────────

  /**
   * Set the adapter used for subsequent uploads. When not set, the default
   * image adapter ({@link imageAdapter}) is used.
   */
  setAdapter(adapter: UploadAdapter): void {
    this.adapter = adapter;
  }

  /**
   * Create a task from a File + config, add to store, and enqueue for upload.
   * @returns The generated task ID.
   */
  enqueue(file: File, config: UploadAdapterConfig): string {
    const id = generateId({ length: 16 });
    const task: UploadTask = {
      id,
      file,
      status: 'queued',
      progress: 0,
      error: null,
      retryCount: 0,
      maxRetries: MAX_AUTO_RETRIES,
      context: config.context,
      skipCompression: config.skipCompression,
      createdAt: new Date().toISOString(),
    };

    useUploadStore.getState().addTask(task);
    this.queue.push(id);
    this.processQueue();
    return id;
  }

  /**
   * Manual retry of a failed task. Resets retry count and re-enqueues.
   */
  retry(taskId: string): void {
    const store = useUploadStore.getState();
    const task = store.tasks.get(taskId);
    if (!task || task.status !== 'error') return;

    store.updateTask(taskId, { status: 'queued', error: null, retryCount: 0, progress: 0 });
    this.queue.push(taskId);
    this.processQueue();
  }

  /**
   * Cancel a task. If uploading, aborts the XHR. Removes from queue.
   */
  cancel(taskId: string): void {
    const store = useUploadStore.getState();
    const task = store.tasks.get(taskId);
    if (!task) return;

    // Abort ongoing XHR if present
    if (task.xhr && task.status === 'uploading') {
      task.xhr.abort();
    }

    // Remove from queue
    this.queue = this.queue.filter((id) => id !== taskId);

    // If it was actively uploading, decrement and kick next
    if (task.status === 'uploading') {
      this.activeCount = Math.max(0, this.activeCount - 1);
    }

    store.removeTask(taskId);

    // Resume processing
    this.processQueue();
  }

  // ── Internal ────────────────────────────────────────────────────────────

  private processQueue(): void {
    while (this.activeCount < this.concurrency && this.queue.length > 0) {
      const nextId = this.queue.shift();
      if (nextId) {
        this.activeCount++;
        this.processTask(nextId).finally(() => {
          this.activeCount = Math.max(0, this.activeCount - 1);
          this.processQueue();
        });
      }
    }
  }

  private async processTask(taskId: string): Promise<void> {
    const store = useUploadStore.getState();
    const task = store.tasks.get(taskId);
    if (!task) return;

    store.updateTask(taskId, { status: 'uploading', error: null });

    const config: UploadAdapterConfig = {
      context: task.context,
      skipCompression: task.skipCompression,
    };

    const adapter = this.resolveAdapter();

    try {
      // Wrap uploadToStorage to capture the XHR reference for abort-on-cancel
      const uploadWithXhrTracking = (
        presignedUrl: string,
        file: File,
        mimeType: string,
        onProgress?: (pct: number) => void,
      ): Promise<void> => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', presignedUrl);
          xhr.setRequestHeader('Content-Type', mimeType);

          // Store XHR reference on task for cancellation
          store.updateTask(taskId, { xhr });

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
              onProgress(Math.round((e.loaded / e.total) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              store.updateTask(taskId, { xhr: undefined });
              resolve();
            } else {
              store.updateTask(taskId, { xhr: undefined });
              reject(new Error(`Failed to upload: ${xhr.status} ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => {
            store.updateTask(taskId, { xhr: undefined });
            reject(new Error('Network error during upload'));
          };
          xhr.ontimeout = () => {
            store.updateTask(taskId, { xhr: undefined });
            reject(new Error('Upload timed out'));
          };
          xhr.send(file);
        });
      };

      const progressAdapter: UploadAdapter = {
        ...adapter,
        uploadToStorage: uploadWithXhrTracking,
      };

      const result = await createUploadPipeline(progressAdapter, task.file, config, (pct) =>
        store.updateTask(taskId, { progress: pct }),
      );

      store.updateTask(taskId, { status: 'uploaded', progress: 100, result });
    } catch (error) {
      const currentTask = store.tasks.get(taskId);
      if (!currentTask) return; // task was cancelled/removed

      const retryCount = currentTask.retryCount + 1;

      if (retryCount <= MAX_AUTO_RETRIES) {
        // Auto-retry with exponential backoff
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, retryCount - 1);
        store.updateTask(taskId, {
          status: 'queued',
          retryCount,
          error: `Retrying (${retryCount}/${MAX_AUTO_RETRIES})...`,
          progress: 0,
        });

        await this.sleep(delay);

        // Re-check task still exists (might have been cancelled during sleep)
        const stillExists = store.tasks.get(taskId);
        if (stillExists && stillExists.status === 'queued') {
          await this.processTask(taskId);
        }
      } else {
        // Final failure — set error for manual retry
        const message = error instanceof Error ? error.message : 'Upload failed';
        store.updateTask(taskId, {
          status: 'error',
          error: message,
          progress: 0,
        });
      }
    }
  }

  /** Adapter used for the next upload: the explicitly set one, or the default image adapter. */
  private resolveAdapter(): UploadAdapter {
    return this.adapter ?? imageAdapter;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ─── Singleton Export ───────────────────────────────────────────────────────

export const uploadManager = new UploadManager();
