import { FileUpload } from '@/components/shared/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { API_URL } from '@/configs/env';
import { usePostStorage } from '@/features/editor/store/use-post-storge';
import { Heart, LinkIcon, MessageCircle, RefreshCcw, ShareIcon } from 'lucide-react';
import { SVGProps } from 'react';

const XMetadataForm = () => {
  const { xMetaImage, xMetaTitle, xMetaDescription, slug, setField } = usePostStorage();

  return (
    <>
      <div className="space-y-2">
        <Label className="mb-2 block">X Meta Image</Label>
        <FileUpload
          previewUrl={xMetaImage || ''}
          onChange={(file) => setField('xMetaImageFile', file as File | null)}
          title="X Meta Image"
          onRemove={() => setField('xMetaImageFile', null)}
        />
      </div>
      <div className="space-y-2">
        <Label>X Meta Title</Label>
        <Input
          name="meta_title"
          value={xMetaTitle || ''}
          onChange={(e) => setField('xMetaTitle', e.target.value)}
          placeholder="X Meta Title"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label>X Meta Description</Label>
        <Textarea
          name="meta_description"
          value={xMetaDescription || ''}
          onChange={(e) => setField('xMetaDescription', e.target.value)}
          placeholder="X Meta Description"
          className="w-full"
        />
      </div>

      <div className="mt-4">
        <XPreview title={xMetaTitle || 'Default Title'} url={`${API_URL}/posts/${slug}`} />
      </div>
    </>
  );
};

export default XMetadataForm;

const XPreview = ({ title, url }: { title: string; url: string }) => {
  return (
    <div className="border-border w-full rounded-lg border p-4">
      <div className="flex max-w-2xl items-start gap-3">
        <TwitterXFill className="size-12" />

        <div className="flex-1 space-y-2">
          <div className="font-bold">
            Piti <span className="text-muted-foreground font-normal">12 hrs</span>
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="h-3 w-full rounded-full bg-[#f1f3f4] dark:bg-[#2e3338]" />
            <div className="h-3 w-7/12 rounded-full bg-[#f1f3f4] dark:bg-[#2e3338]" />
          </div>

          <div className="border-border rounded-2xl border p-4">
            <div className="font-semibold">{title}</div>
            <div className="text-muted-foreground flex items-center text-sm">
              <LinkIcon className="size-3" />
              {url}
            </div>
          </div>

          <div className="grid grid-cols-4 place-items-start">
            <div className="text-muted-foreground flex items-center gap-1">
              <MessageCircle className="size-4" />
              <span className="text-sm">2</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <RefreshCcw className="size-4" />
              <span className="text-sm">11</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Heart className="size-4" />
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

export function TwitterXFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path
        fill="currentColor"
        d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"
      ></path>
    </svg>
  );
}
