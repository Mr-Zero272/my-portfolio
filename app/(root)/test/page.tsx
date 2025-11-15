'use client';

import ImagePreviewPanel from '@/features/gallery/components/image-preview-panel';
import { IImage } from '@/models';
import mongoose from 'mongoose';
import { useState } from 'react';

const TestPage = () => {
  const [gallery, setGallery] = useState<IImage | null>(null);
  return (
    <div className="space-y-2 px-4">
      {/* <CommentBox onSubmit={() => {}} /> */}
      {/* <PostCommentFeature postId="68ea574e91711ee64f196e50" /> */}
      {/* <DrawerCommentMobile open={true} /> */}
      <ImagePreviewPanel
        image={
          {
            _id: new mongoose.Types.ObjectId('6554d1933c0e86b0f9e9a4f4') as never,
            url: 'https://i.pinimg.com/1200x/df/8e/c1/df8ec1a567d1ddfad2d81c7696aa4273.jpg',
            name: 'Beautiful Landscape',
            size: 204800,
            mineType: 'image/jpg',
            userCreated: { _id: 'user12345', name: 'John Doe', email: 'BtH0w@example.com' } as never,
            caption: 'A breathtaking view of the mountains during sunset.',
            createdAt: new Date('2024-06-15T09:00:00Z'),
            updatedAt: new Date('2024-06-15T09:00:00Z'),
          } as never
        }
        onDownload={() => {}}
        onClose={() => {}}
      />
    </div>
  );
};

export default TestPage;
