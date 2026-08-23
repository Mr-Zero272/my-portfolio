'use client'

import { useDownloadFile } from "@/hooks/use-download-file";
import { useCallback } from "react";
import { AsyncButton, AsyncButtonProps } from "./async-button";

interface DownloadButtonProps extends AsyncButtonProps {
  url: string;
  buttonLabel?: string
}

export const DownloadButton = ({ url, buttonLabel = 'Download', ...props }: DownloadButtonProps) => {
  const { download, isDownloading } = useDownloadFile();

  const handleDownload = useCallback(async () => {
    await download(url);
  }, [download, url]);

  return (
    <AsyncButton
      action={handleDownload}
      disabled={isDownloading}
      {...props}
    >
      {buttonLabel}
    </AsyncButton>
  )
}