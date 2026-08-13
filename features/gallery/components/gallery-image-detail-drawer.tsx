'use client';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { formatDateTime, formatFileSize } from '@/lib/format';
import { GalleryImage } from '@/lib/generated/prisma/client';
import { DownloadIcon, ExternalLinkIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { ReactNode, useMemo } from 'react';

import { MOBILE_BREAKPOINT } from '@/constants/breakpoints';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@mantine/hooks';
import { getMineTypeConfig } from '../constants';

// ─── Props ──────────────────────────────────────────────────────────────────

interface GalleryImageDetailDrawerProps {
  /** Image to show. `null` keeps the drawer closed. */
  image: GalleryImage | null;
  onOpenChange: (open: boolean) => void;
  isDownloading?: boolean;
  onDownload?: (image: GalleryImage) => void;
  onDelete?: (image: GalleryImage) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-muted-foreground shrink-0 text-sm">{label}</span>
      <span className="text-foreground min-w-0 truncate text-right text-sm font-medium wrap-break-word">
        {value ?? '--'}
      </span>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export const GalleryImageDetailDrawer = ({
  image,
  onOpenChange,
  isDownloading,
  onDownload,
  // onDelete,
}: GalleryImageDetailDrawerProps) => {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
  const mimeLabel = useMemo(() => {
    if (!image) return '';
    const config = getMineTypeConfig(image.mimeType);
    return config?.label || image.mimeType;
  }, [image]);

  return (
    <Drawer
      direction={isMobile ? 'bottom' : 'right'}
      open={Boolean(image)}
      onOpenChange={onOpenChange}
    >
      <DrawerContent className="h-[90vh] w-full! sm:h-full sm:max-w-md">
        {/* Header */}
        <DrawerHeader className="border-border border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DrawerTitle className="truncate">{image?.name ?? 'Image details'}</DrawerTitle>
              <DrawerDescription>
                {image ? formatDateTime(image.createdAt) : 'Loading…'}
              </DrawerDescription>
            </div>
            <DrawerClose asChild className="hidden sm:block">
              <Button variant="ghost" size="icon" className="size-8">
                <XIcon />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Body */}
        <ScrollArea className="min-h-0 flex-1">
          {image && (
            <div className="flex flex-col gap-4 p-4">
              <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-md">
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  sizes="(max-width: 448px) 100vw, 448px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{mimeLabel}</Badge>
                <Badge variant="outline">{formatFileSize(image.size)}</Badge>
              </div>

              <Separator />

              <div className="flex flex-col divide-y">
                <InfoRow label="Name" value={image.name} />
                <InfoRow label="MIME type" value={image.mimeType} />
                <InfoRow label="Size" value={formatFileSize(image.size)} />
                <InfoRow label="Caption" value={image.caption || undefined} />
                <InfoRow label="Created" value={formatDateTime(image.createdAt)} />
                <InfoRow label="Updated" value={formatDateTime(image.updatedAt)} />
                <InfoRow label="ID" value={image.id} />
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <DrawerFooter className="flex-row flex-wrap">
          <a
            href={image?.url}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
          >
            <ExternalLinkIcon />
            Open original
          </a>

          <Button
            disabled={isDownloading || !image}
            onClick={() => image && onDownload?.(image)}
            className="w-full"
          >
            {isDownloading ? <Spinner size="sm" /> : <DownloadIcon />}
            Download
          </Button>
          {/* <Button
              variant="destructive"
              disabled={!image}
              onClick={() => image && onDelete?.(image)}
            >
              <TrashIcon />
              Delete
            </Button> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
