import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type IImage } from '@/models';
import { Download, Share } from 'lucide-react';
import Image from 'next/image';

interface ImageCardProps {
  image: IImage;
  onImageClick: (image: IImage) => void;
  onDownload: (imageUrl: string, imageName: string) => void;
}

const ImageCard = ({ image, onImageClick, onDownload }: ImageCardProps) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(image.url, image.name);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement share functionality
    console.log('Share functionality will be implemented later');
  };

  return (
    <Card
      className="group m-0 cursor-pointer overflow-hidden p-0 transition-all duration-300 hover:shadow-lg"
      onClick={() => onImageClick(image)}
    >
      <div className="relative">
        <Image
          src={image.url}
          alt={image.name}
          width={400}
          height={300}
          className="h-auto w-full object-cover"
          unoptimized
        />

        {/* Top overlay */}
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bottom overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-end justify-between">
            <span className="rounded bg-white/20 px-2 py-1 text-xs text-white backdrop-blur-sm">{image.mineType}</span>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ImageCard;

export const ImageCardSkeleton = () => {
  const randomHeight = Math.floor(Math.random() * (500 - 200 + 1)) + 200; // Random height between 200 and 300
  const randomWidth = Math.floor(Math.random() * (400 - 300 + 1)) + 300; // Random width between 300 and 400
  return (
    <Card className="m-0 cursor-pointer overflow-hidden border-none p-0 shadow-none transition-all duration-300">
      <div className="relative">
        <Skeleton
          style={{
            height: randomHeight,
            width: randomWidth,
          }}
        />

        {/* Top overlay */}
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex justify-end">
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>

        {/* Bottom overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-end justify-between">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </Card>
  );
};
