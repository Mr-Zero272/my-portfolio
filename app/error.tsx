'use client';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { ArrowUpRightIcon, BanIcon, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BanIcon />
          </EmptyMedia>
          <EmptyTitle>Something went wrong!</EmptyTitle>
          <EmptyDescription>{error.message || 'There was an error occurred, we are working on it.'}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button asChild>
            <Link href="/">
              <Home />
              Home
            </Link>
          </Button>
          <Button variant="outline" onClick={reset}>
            <RefreshCw />
            Try Again
          </Button>
        </EmptyContent>
        <Button variant="link" asChild className="text-muted-foreground" size="sm">
          <Link href="https://github.com/Mr-Zero272" target="_blank" rel="noopener noreferrer">
            Learn More <ArrowUpRightIcon />
          </Link>
        </Button>
      </Empty>
    </div>
  );
};

export default Error;
