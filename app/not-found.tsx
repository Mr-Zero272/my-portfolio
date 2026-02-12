'use client';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { ArrowLeft, ArrowUpRightIcon, Home, SearchXIcon } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>Page Not Found</EmptyTitle>
          <EmptyDescription>The page you are looking for does not exist.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button asChild>
            <Link href="/">
              <Home />
              Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">
              <ArrowLeft />
              Contact
            </Link>
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
}
