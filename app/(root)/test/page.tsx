'use client';

import { CommentBox } from '@/features/post-comments/components';
import DrawerCommentMobile from '@/features/post-comments/components/drawer-comment-mobile';

const TestPage = () => {
  return (
    <div className="space-y-2 px-4">
      <CommentBox onSubmit={() => {}} />
      {/* <PostCommentFeature postId="68ea574e91711ee64f196e50" /> */}
      <DrawerCommentMobile open={true} />
    </div>
  );
};

export default TestPage;
