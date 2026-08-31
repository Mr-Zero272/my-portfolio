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
import { ImageOffIcon } from 'lucide-react';
import Image from 'next/image';
import { SkillWithAllRelations } from '../types';

interface SkillCardProps {
  skill: SkillWithAllRelations;
  mode?: 'public' | 'private';
  actions?: React.ReactNode;
  dragHandle?: React.ReactNode;
}

export const SkillCard = ({ skill, mode = 'public', actions, dragHandle }: SkillCardProps) => {
  return (
    <Card className="transition-transform hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-3">
          {dragHandle && mode === 'private' && <div className="-mt-4 -ml-2">{dragHandle}</div>}
          {skill.icon?.url ? (
            <Image
              className="size-10 rounded-md"
              src={skill.icon.url}
              alt={skill.name}
              width={50}
              height={50}
              unoptimized
            />
          ) : (
            <ImageOffIcon className="text-muted-foreground size-10 rounded-md" />
          )}
          <div>
            <CardTitle>{skill.name}</CardTitle>
            <CardDescription>{skill.category}</CardDescription>
          </div>
        </div>
        {actions && mode === 'private' && (
          <CardAction className="flex items-center gap-1">{actions}</CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div
          className={cn('flex items-center gap-2', {
            'ml-10': dragHandle && mode === 'private',
          })}
        >
          <Badge variant="secondary">{skill.proficiency}</Badge>
          <Badge variant="secondary">{`${skill.yearsOfExperience} ${(skill.yearsOfExperience ?? 0 > 1) ? 'years' : 'year'}`}</Badge>
          {mode === 'private' && !skill.isVisible && (
            <Badge variant="destructive">Not Visible</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
