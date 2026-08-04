'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';
import { BookOpenIcon, FolderKanbanIcon, TagsIcon } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  {
    href: '/dashboard/tags',
    icon: <TagsIcon className="size-5" />,
    label: 'Tags',
    description: 'Manage your content tags',
  },
  {
    href: '/dashboard/posts',
    icon: <BookOpenIcon className="size-5" />,
    label: 'Posts',
    description: 'Manage your blog posts',
  },
  {
    href: '/dashboard/projects',
    icon: <FolderKanbanIcon className="size-5" />,
    label: 'Projects',
    description: 'Manage your projects',
  },
];

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="flex flex-1 flex-col gap-6 py-6">
      {/* Welcome Section */}
      <div>
        {isPending ? (
          <Skeleton className="h-8 w-64" />
        ) : (
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{user?.name ? `, ${user.name}` : ''} 👋
          </h1>
        )}
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your portfolio management.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Card key={link.href} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {link.icon}
                  {link.label}
                </CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" render={<Link href={link.href} />}>
                  View {link.label}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Status Badge */}
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Session status:</span>
        {isPending ? (
          <Skeleton className="h-5 w-20" />
        ) : session ? (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          >
            Authenticated
          </Badge>
        ) : (
          <Badge variant="secondary">Unauthenticated</Badge>
        )}
      </div>
    </div>
  );
}
