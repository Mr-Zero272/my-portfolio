import { GoogleIcon } from '@/components/icons';
import { SearchIcon } from 'lucide-react';

export const GoogleSearchPreview = ({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) => {
  return (
    <div className="border-border w-full space-y-2 rounded-lg border p-4">
      <div className="flex max-w-2xl items-center gap-3">
        <GoogleIcon className="size-5" />

        <div className="relative h-8 flex-1 rounded-full bg-[#f1f3f4] p-1 dark:bg-[#2e3338]">
          <SearchIcon className="absolute top-1/2 right-2 size-4 -translate-x-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      <div className="max-w-2xl">
        <div className="text-sm text-green-800">{url}</div>
        <div className="mb-1 cursor-pointer text-xl leading-6 text-blue-800 hover:underline dark:text-blue-600">
          {title}
        </div>
        <div className="text-muted-foreground line-clamp-3 text-sm leading-5">{description}</div>
      </div>
    </div>
  );
};
