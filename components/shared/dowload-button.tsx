'use client';

import { useDownloadFile } from '@/hooks/use-download-file';
import { useCallback } from 'react';
import { AsyncButton, AsyncButtonProps } from './async-button';

interface DownloadButtonProps extends AsyncButtonProps {
  url: string;
  buttonLabel?: string;
  fileName?: string;
}

export const DownloadButton = ({
  url,
  buttonLabel = 'Download',
  fileName,
  ...props
}: DownloadButtonProps) => {
  const { download, isDownloading } = useDownloadFile();

  const handleDownload = useCallback(async () => {
    await download(url, fileName);
  }, [download, url, fileName]);

  return (
    <AsyncButton action={handleDownload} disabled={isDownloading} {...props}>
      {buttonLabel}
    </AsyncButton>
  );
};
