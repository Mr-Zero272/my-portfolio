import { XIcon } from '@/components/icons';
import { HeartIcon, LinkIcon, MessageCircleIcon, RefreshCcwIcon, ShareIcon } from 'lucide-react';

export const XPreview = ({ title, url }: { title: string; url: string }) => {
  return (
    <div className="border-border flex w-full overflow-hidden rounded-lg border p-4">
      <div className="flex w-full flex-1 items-start gap-3 overflow-hidden">
        <div>
          <XIcon className="size-6" />
        </div>

        <div className="w-full flex-1 space-y-2 overflow-hidden">
          <div className="font-bold">
            Piti <span className="text-muted-foreground font-normal">12 hrs</span>
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="h-3 w-full rounded-full bg-[#f1f3f4] dark:bg-[#2e3338]" />
            <div className="h-3 w-7/12 rounded-full bg-[#f1f3f4] dark:bg-[#2e3338]" />
          </div>

          <div className="border-border w-full overflow-hidden rounded-2xl border p-3">
            <div className="font-semibold">{title || 'Your story title'}</div>
            <div className="flex items-center gap-1 overflow-hidden">
              <div>
                <LinkIcon className="size-3" />
              </div>
              <span className="text-muted-foreground line-clamp-1 flex-1 truncate">{url}</span>
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
