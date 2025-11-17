'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';

const TestPage = () => {
  const { mutateAsync: likePostTest, isPending } = useMutation({
    mutationFn: (postId: string) =>
      fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }),
  });

  return (
    <div className="space-y-2 px-4">
      <Button disabled={isPending} onClick={() => likePostTest('123')}>
        Test api
      </Button>
    </div>
  );
};

export default TestPage;
