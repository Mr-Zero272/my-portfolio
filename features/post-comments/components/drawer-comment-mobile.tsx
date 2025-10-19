import { DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import PostCommentFeature from '..';
import CommentBox from './comment-box';

type DrawerCommentMobileProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

const DrawerCommentMobile = ({ open, onOpenChange, trigger }: DrawerCommentMobileProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent className="min-h-[95vh]">
        <DrawerHeader>
          <DialogTitle>Comments</DialogTitle>
        </DrawerHeader>
        <div className="h-full overflow-y-auto px-4">
          <PostCommentFeature postId="68ea574e91711ee64f196e50" />
        </div>
        <DrawerFooter>
          <CommentBox onSubmit={() => {}} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerCommentMobile;
