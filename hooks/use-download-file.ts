'use client';

import { useCallback, useRef, useState } from 'react';

interface UseDownloadFileOptions {
  /** Called when the download fails */
  onError?: (error: Error) => void;
  /** Called when the download completes successfully */
  onSuccess?: () => void;
}

interface UseDownloadFileReturn {
  /** Triggers a file download via the server proxy */
  download: (fileUrl: string, filename?: string) => Promise<void>;
  /** Whether a download is currently in progress */
  isDownloading: boolean;
}

/**
 * Hook for downloading files through the server-side proxy (`/api/download`)
 * to avoid CORS issues when fetching from external storage (S3, R2, etc.).
 *
 * The download flow:
 * 1. Calls `GET /api/download?url=...&filename=...`
 * 2. The route handler fetches the file server-side and streams it back
 * 3. The hook creates a blob from the response and triggers a browser download
 */
export function useDownloadFile(options?: UseDownloadFileOptions): UseDownloadFileReturn {
  const [isDownloading, setIsDownloading] = useState(false);
  const optionsRef = useRef(options);

  const download = useCallback(async (fileUrl: string, filename?: string) => {
    setIsDownloading(true);

    try {
      const params = new URLSearchParams({ url: encodeURIComponent(fileUrl) });
      if (filename) params.set('filename', filename);

      const response = await fetch(`/api/download?${params.toString()}`);

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: 'Download failed' }));
        throw new Error(body.error ?? `Download failed (${response.status})`);
      }

      // Stream the response into a blob and trigger browser download
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = filename ?? fileUrl.split('/').pop() ?? 'download';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);

      optionsRef.current?.onSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Download failed');
      optionsRef.current?.onError?.(err);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { download, isDownloading };
}
