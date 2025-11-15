import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatFileSize } from '@/lib';
import { type IImage } from '@/models';
import { format } from 'date-fns';
import { Calendar, Download, FileImage, HardDrive, User, XIcon } from 'lucide-react';
import Image from 'next/image';

interface ImagePreviewPanelProps {
  image: IImage | null;
  onDownload: (imageUrl: string, imageName: string) => void;
  onClose: () => void;
}

const ImagePreviewPanel = ({ image, onDownload, onClose }: ImagePreviewPanelProps) => {
  if (!image) {
    return null;
  }

  return (
    <Card className="sticky top-20 h-fit">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Image detail
        </CardTitle>
        <AnimatedButton variant="none" className="size-6" onClick={onClose} aria-label="Close">
          <XIcon className="h-4 w-4" />
        </AnimatedButton>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Preview */}
        <div className="bg-muted relative aspect-video overflow-hidden rounded-lg">
          <Image src={image.url} alt={image.name} fill className="object-contain" unoptimized />
        </div>

        {/* Image Name */}
        <div>
          <h3 className="text-lg font-semibold break-words">{image.name}</h3>
          {image.caption && <p className="text-muted-foreground mt-1 text-sm">{image.caption}</p>}
        </div>

        <Separator />

        {/* Image Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <HardDrive className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground">Size:</span>
            <span className="text-sm font-medium">{formatFileSize(image.size)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <FileImage className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground">MIME:</span>
            <span className="text-sm font-medium">{image.mineType}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground">Created at:</span>
            <span className="text-sm font-medium">{format(image.createdAt, 'dd MMM, yyy hh:mm')}</span>
          </div>

          {image.updatedAt && image.updatedAt !== image.createdAt && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground">Updated at:</span>
              <span className="text-sm font-medium">{format(image.updatedAt, 'dd MMM, yyy hh:mm')}</span>
            </div>
          )}

          {image.userCreated && (
            <div className="flex items-center gap-2 text-sm">
              <User className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-nowrap">Created by:</span>
              <span className="overflow-hidden text-sm font-medium text-nowrap text-ellipsis">
                {typeof image.userCreated === 'object' && image.userCreated && 'name' in image.userCreated
                  ? String(image.userCreated.name)
                  : 'User'}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button className="w-full" onClick={() => onDownload(image.url, image.name)}>
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePreviewPanel;
