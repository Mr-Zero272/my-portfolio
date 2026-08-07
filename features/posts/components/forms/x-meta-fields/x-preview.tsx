import { XBrand } from '@/components/icons';
import { HeartIcon, LinkIcon, MessageCircleIcon, RefreshCcwIcon, ShareIcon } from 'lucide-react';

export const XPreview = ({ title, url }: { title: string; url: string }) => {
  return (
    <div className="border-border w-full rounded-lg border p-4">
      <div className="flex max-w-2xl items-start gap-3">
        <XBrand className="size-12" />

        <div className="flex-1 space-y-2">
          <div className="font-bold">
            Piti <span className="text-muted-foreground font-normal">12 hrs</span>
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="h-3 w-full rounded-full bg-[#f1f3f4] dark:bg-[#2e3338]" />
            <div className="h-3 w-7/12 rounded-full bg-[#f1f3f4] dark:bg-[#2e3338]" />
          </div>

          <div className="border-border rounded-2xl border p-4">
            <div className="font-semibold">{title ?? 'Your story title'}</div>
            <div className="text-muted-foreground flex items-center text-sm">
              <LinkIcon className="me-1 size-3" />
              {url}
            </div>
          </div>

          <div className="grid grid-cols-4 place-items-start">
            <div className="text-muted-foreground flex items-center gap-1">
              <MessageCircleIcon className="size-4" />
              <span className="text-sm">2</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <RefreshCcwIcon className="size-4" />
              <span className="text-sm">11</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <HeartIcon className="size-4" />
              <span className="text-sm">32</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <ShareIcon className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
