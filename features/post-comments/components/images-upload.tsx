import { Button } from '@/components/ui/button';
import { Eye, XIcon } from 'lucide-react';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

type ImagesUploadProps = {
  images?: string[];
  onRemove?: (index: number) => void;
};

const ImagesUpload = ({ images, onRemove }: ImagesUploadProps) => {
  // Cleanup blob URLs when component unmounts
  // useEffect(() => {
  //   return () => {
  //     images?.forEach((url) => {
  //       // Only revoke blob URLs, not regular URLs
  //       if (url.startsWith('blob:')) {
  //         URL.revokeObjectURL(url);
  //       }
  //     });
  //   };
  // }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <PhotoProvider>
      <div className="flex gap-2">
        {images.map((src, index) => (
          <PhotoView key={src} src={src}>
            <div className="group relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border">
              {/* Remove button */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-0.5 right-0.5 z-20 hidden size-5 group-hover:inline-flex"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(index);
                }}
              >
                <XIcon className="size-3" />
              </Button>

              {/* Layer when hover */}
              <div className="absolute inset-0 z-10 hidden cursor-pointer items-center justify-center bg-black/30 group-hover:flex">
                <Eye className="size-3 text-white" />
              </div>
              <Image
                src={src}
                alt={`Uploaded ${index + 1}`}
                className="h-full w-full object-cover"
                width={400}
                height={300}
              />
            </div>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
};

export default ImagesUpload;
