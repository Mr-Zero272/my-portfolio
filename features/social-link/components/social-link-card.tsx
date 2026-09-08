'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SocialLink } from '@prisma/client';
import { ExternalLinkIcon } from 'lucide-react';
import { getSocialLinkPlatformConfig, SocialLinkPlatform } from '../constants';

interface SocialLinkCardProps {
  socialLink: SocialLink;
  mode?: 'public' | 'private';
  actions?: React.ReactNode;
  dragHandle?: React.ReactNode;
}

export const SocialLinkCard = ({
  socialLink,
  mode = 'private',
  actions,
  dragHandle,
}: SocialLinkCardProps) => {
  const platformConfig = getSocialLinkPlatformConfig(socialLink.platform as SocialLinkPlatform);
  const IconComponent = platformConfig.icon;

  return (
    <Card className="transition-transform hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-3">
          {dragHandle && mode === 'private' && <div className="-mt-4 -ml-2">{dragHandle}</div>}
          <div className="bg-accent/50 text-foreground flex size-10 items-center justify-center rounded-md border p-2">
            <IconComponent className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{platformConfig.label}</CardTitle>
            <CardDescription className="truncate">
              {socialLink.username ? `@${socialLink.username}` : socialLink.url}
            </CardDescription>
          </div>
        </div>
        {actions && mode === 'private' && (
          <CardAction className="flex items-center gap-1">{actions}</CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div
          className={cn('flex items-center justify-between gap-2', {
            'ml-10': dragHandle && mode === 'private',
          })}
        >
          <div className="flex items-center gap-2">
            {mode === 'private' && (
              <Badge variant={socialLink.isActive ? 'default' : 'secondary'}>
                {socialLink.isActive ? 'Active' : 'Inactive'}
              </Badge>
            )}
          </div>
          <a
            href={socialLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
          >
            Visit <ExternalLinkIcon className="size-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
