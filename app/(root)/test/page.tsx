'use client';

import { AnimatedButton } from '@/components/ui/animated-button';
import GallerySelect from '@/features/gallery/components/gallery-select';
import { IImage } from '@/models';
import Image from 'next/image';
import { useState } from 'react';

const TestPage = () => {
  const [gallery, setGallery] = useState<IImage | null>(null);
  return (
    <div className="space-y-2 px-4">
      {/* <CommentBox onSubmit={() => {}} /> */}
      {/* <PostCommentFeature postId="68ea574e91711ee64f196e50" /> */}
      {/* <DrawerCommentMobile open={true} /> */}
      {gallery && <Image src={gallery.url} alt={gallery.name} width={400} height={300} />}
      <GallerySelect
        value={gallery}
        onValueChange={(img) => {
          setGallery(img);
        }}
        trigger={<AnimatedButton variant="ghost">Select gallery</AnimatedButton>}
      />
    </div>
  );
};

export default TestPage;
