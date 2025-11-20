'use client';

import { postApi } from '@/apis/post';
import { AnimatedButton } from '@/components/ui/animated-button';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'nextjs-toploader/app';
import { useState } from 'react';
import { toast } from 'sonner';

interface LikePostProps {
  slug: string;
  initialLikes: number;
  initialLikedBy: string[];
}

export function LikePost({ slug, initialLikes, initialLikedBy }: LikePostProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  const [likes, setLikes] = useState(initialLikes);
  const [likedBy, setLikedBy] = useState<string[]>(initialLikedBy);

  const isLiked = userId ? likedBy.includes(userId) : false;

  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: async () => {
      if (!userId) {
        router.push('/auth/signin');
        return;
      }

      if (isLiked) {
        await postApi.unlikePost({ slug });
        setLikes((prev) => Math.max(0, prev - 1));
        setLikedBy((prev) => prev.filter((id) => id !== userId));
      } else {
        await postApi.likePost({ slug });
        setLikes((prev) => prev + 1);
        setLikedBy((prev) => [...prev, userId]);
      }
    },
    onError: (error) => {
      toast.error('Failed to update like status');
      console.error(error);
      // Revert optimistic update
      if (isLiked) {
        setLikes((prev) => prev + 1);
        setLikedBy((prev) => [...prev, userId!]);
      } else {
        setLikes((prev) => Math.max(0, prev - 1));
        setLikedBy((prev) => prev.filter((id) => id !== userId));
      }
    },
  });

  const getLikeLabel = () => {
    if (likes === 0) return null;

    if (isLiked) {
      if (likes === 1) return 'You';
      return `You and ${likes - 1} others`;
    }

    return `${likes} likes`;
  };

  return (
    <div className="flex items-center gap-2">
      <AnimatedButton
        variant="ghost"
        size="sm"
        className={cn('text-gray-600 hover:text-red-500', isLiked && 'text-red-500')}
        onClick={() => toggleLike()}
        disabled={isPending}
      >
        <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
        {likes}
      </AnimatedButton>
      {likes > 0 && <span className="text-muted-foreground text-sm">{getLikeLabel()}</span>}
    </div>
  );
}
