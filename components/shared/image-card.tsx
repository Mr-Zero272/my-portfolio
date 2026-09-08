import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CheckIcon, DownloadIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Spinner } from '../ui/spinner';

interface ImageCardProps {
  className?: string;

  src: string;
  alt: string;
  mineType?: string;

  mode?: 'view' | 'select';
  isActive?: boolean;

  isDownloading?: boolean;

  menu?: React.ReactNode;

  onDownload?: () => void;
  onClick?: () => void;
  onSelect?: () => void;
}

const ImageCard = ({
  className,
  src,
  alt,
  mineType = 'image/webp',
  mode = 'view',
  isActive,
  isDownloading,
  menu,
  onClick,
  onSelect,
  onDownload,
}: ImageCardProps) => {
  return (
    <Card
      className={cn(
        'group m-0 cursor-pointer overflow-hidden p-0 transition-all duration-300 hover:shadow-lg',
        className,
      )}
      onClick={() => {
        if (mode === 'view') onClick?.();
        if (mode === 'select') onSelect?.();
      }}
    >
      {/* @container wrapper so child queries can respond to card height */}
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          width={400}
          height={300}
          className="h-auto w-full object-cover"
          unoptimized
        />

        {/* unified overlay + actions */}
        <div
          className={cn(
            'absolute inset-0 opacity-0 group-hover:opacity-100',
            'bg-black/20',
            'flex flex-col justify-between p-3',
            { 'opacity-100': mode === 'select' && isActive },
          )}
        >
          {/* top row: select indicator + download */}
          <div className="flex items-start justify-between">
            {isActive ? (
              <div className="bg-primary -mt-3 flex items-center justify-center rounded-b-sm p-1 text-white">
                <CheckIcon className="size-3" />
              </div>
            ) : (
              <div />
            )}
            {onDownload ? (
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                disabled={isDownloading}
              >
                {isDownloading ? <Spinner /> : <DownloadIcon />}
              </Button>
            ) : (
              <div />
            )}
          </div>

          {/* bottom row: hidden when container is too short (@container < 120px) */}
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-1 overflow-hidden">
              <span className="w-fit truncate rounded-sm bg-white/20 px-2 py-1 text-xs text-white backdrop-blur-sm">
                {mineType}
              </span>
            </div>
            {menu ? menu : <div />}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ImageCard;

export const ImageCardSkeleton = () => {
  const [height] = useState(() => Math.floor(Math.random() * (500 - 200 + 1)) + 200);
  return (
    <Card className="m-0 w-full cursor-pointer overflow-hidden border-none p-0 shadow-none transition-all duration-300">
      <div className="relative">
        <Skeleton
          className="w-full"
          style={{
            height,
          }}
        />
      </div>
    </Card>
  );
};
