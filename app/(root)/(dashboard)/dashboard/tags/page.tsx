'use client';

import StateUI from '@/components/shared/state-ui';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTags } from '@/features/tags/hooks';
import { format } from 'date-fns';
import { HashIcon, TagsIcon } from 'lucide-react';

export default function TagsPage() {
  const { data, isLoading, isError, error } = useTags();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 py-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-72" />
        </div>
        <Card>
          <CardContent className="pt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="mb-3 h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <StateUI
          variant="error"
          title="Failed to load tags"
          description={error instanceof Error ? error.message : 'An unexpected error occurred'}
        />
      </div>
    );
  }

  const tags = data?.items ?? [];

  if (tags.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <StateUI
          variant="empty"
          icon={<TagsIcon />}
          title="No tags yet"
          description="Create your first tag to start organizing your content."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 py-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
        <p className="text-muted-foreground mt-1">
          Manage your content tags. Total: {data?.pagination?.total ?? tags.length} tags.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <HashIcon className="size-4" />
            All Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-75">Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Posts</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {tag.slug}
                  </TableCell>
                  <TableCell className="text-center">
                    {/* @ts-expect-error - _count from Prisma include */}
                    <Badge variant="secondary">{tag._count?.posts ?? 0}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right text-sm">
                    {tag.createdAt ? format(new Date(tag.createdAt), 'dd/MM/yyyy') : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
