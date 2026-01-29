import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, FileText, FolderGit2, ThumbsUp, TrendingUp } from 'lucide-react';

interface SectionCardsProps {
  stats: {
    totalProjects: number;
    totalPosts: number;
    totalUsers: number;
    totalViews: number;
    totalLikes: number;
  };
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalProjects}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <FolderGit2 className="mr-1 size-3" />
              Projects
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Portfolio Items <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Showcased work</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Posts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalPosts}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <FileText className="mr-1 size-3" />
              Articles
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Shared knowledge</div>
          <div className="text-muted-foreground">Blog entries</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Views</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalViews.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Eye className="mr-1 size-3" />
              Engagement
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Across all posts</div>
          <div className="text-muted-foreground">Reader interest</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Likes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalLikes.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ThumbsUp className="mr-1 size-3" />
              Reactions
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Community appreciation</div>
          <div className="text-muted-foreground">Positive feedback</div>
        </CardFooter>
      </Card>
    </div>
  );
}
