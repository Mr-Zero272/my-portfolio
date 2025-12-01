import {
  BriefcaseBusinessIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  CodeXmlIcon,
  DraftingCompassIcon,
  GraduationCapIcon,
  Pencil,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const iconMap = {
  code: CodeXmlIcon,
  design: DraftingCompassIcon,
  business: BriefcaseBusinessIcon,
  education: GraduationCapIcon,
} as const;

/**
 * Represents the valid keys of the `iconMap` object, used to specify the type of icon
 * associated with an experience position.
 */
export type ExperiencePositionIconType = keyof typeof iconMap;

export type ExperiencePositionItemType = {
  /** Unique identifier for the position */
  _id: string;
  /** The job title or position name */
  title: string;
  /** The period during which the position was held (e.g., "Jan 2020 - Dec 2021") */
  employmentPeriod: string;
  /** The type of employment (e.g., "Full-time", "Part-time", "Contract") */
  employmentType?: string;
  /** A brief description of the position or responsibilities */
  description?: string;
  /** An icon representing the position */
  icon?: ExperiencePositionIconType;
  /** A list of skills associated with the position */
  skills?: string[];
  /** Indicates if the position details are expanded in the UI */
  isExpanded?: boolean;
};

export type ExperienceItemType = {
  /** Unique identifier for the experience item */
  _id: string;
  /** Name of the company where the experience was gained */
  companyName: string;
  /** URL or path to the company's logo image */
  companyLogo?: string;
  /** List of positions held at the company */
  positions: ExperiencePositionItemType[];
  /** Indicates if this is the user's current employer */
  isCurrentEmployer?: boolean;
};

export function WorkExperience({
  className,
  experiences,
  mode,
  onEditClick,
  onDeleteClick,
}: {
  className?: string;
  experiences: ExperienceItemType[];
  mode?: 'admin';
  onEditClick?: (experience: ExperienceItemType) => void;
  onDeleteClick?: (id: string) => void;
}) {
  return (
    <div className={cn('bg-background px-4', className)}>
      {experiences.map((experience) => (
        <ExperienceItem
          key={experience._id}
          experience={experience}
          mode={mode}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
}

export function ExperienceItem({
  experience,
  mode,
  onEditClick,
  onDeleteClick,
}: {
  experience: ExperienceItemType;
  mode?: 'admin';
  onEditClick?: (experience: ExperienceItemType) => void;
  onDeleteClick?: (id: string) => void;
}) {
  return (
    <div className="group/item relative space-y-4 py-4">
      <div className="not-prose flex items-center gap-3">
        <div className="flex size-6 shrink-0 items-center justify-center" aria-hidden>
          {experience.companyLogo ? (
            <Image
              src={experience.companyLogo}
              alt={experience.companyName}
              width={24}
              height={24}
              quality={100}
              className="rounded-full"
              unoptimized
            />
          ) : (
            <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          )}
        </div>

        <h3 className="text-foreground text-lg leading-snug font-medium">{experience.companyName}</h3>

        {experience.isCurrentEmployer && (
          <span className="relative flex items-center justify-center">
            <span className="bg-info absolute inline-flex size-3 animate-ping rounded-full opacity-50" />
            <span className="bg-info relative inline-flex size-2 rounded-full" />
            <span className="sr-only">Current Employer</span>
          </span>
        )}

        {mode === 'admin' && (
          <div className="ml-auto flex items-center gap-2 opacity-0 transition-opacity group-hover/item:opacity-100">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditClick?.(experience)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive h-8 w-8"
              onClick={() => onDeleteClick?.(experience._id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )}
      </div>

      <div className="before:bg-border relative space-y-4 before:absolute before:left-3 before:h-full before:w-px">
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position._id} position={position} />
        ))}
      </div>
    </div>
  );
}

export function ExperiencePositionItem({ position }: { position: ExperiencePositionItemType }) {
  const ExperienceIcon = iconMap[position.icon || 'business'];

  return (
    <Collapsible defaultOpen={position.isExpanded} asChild>
      <div className="last:before:bg-background relative last:before:absolute last:before:h-full last:before:w-4">
        <CollapsibleTrigger
          className={cn(
            'group/experience not-prose block w-full text-left select-none',
            'hover:before:bg-muted/50 relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg',
          )}
        >
          <div className="relative z-1 mb-1 flex items-center gap-3">
            <div
              className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-lg"
              aria-hidden
            >
              <ExperienceIcon className="size-4" />
            </div>

            <h4 className="text-foreground flex-1 text-base font-medium text-balance">{position.title}</h4>

            <div className="text-muted-foreground shrink-0 [&_svg]:size-4" aria-hidden>
              <ChevronsDownUpIcon className="hidden group-data-[state=open]/experience:block" />
              <ChevronsUpDownIcon className="hidden group-data-[state=closed]/experience:block" />
            </div>
          </div>

          <div className="text-muted-foreground relative z-1 flex items-center gap-2 pl-9 text-sm">
            {position.employmentType && (
              <>
                <dl>
                  <dt className="sr-only">Employment Type</dt>
                  <dd>{position.employmentType}</dd>
                </dl>

                <Separator className="data-[orientation=vertical]:h-4" orientation="vertical" />
              </>
            )}

            <dl>
              <dt className="sr-only">Employment Period</dt>
              <dd>{position.employmentPeriod}</dd>
            </dl>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden duration-300">
          {position.description && (
            <Prose className="pt-2 pl-9">
              <ReactMarkdown>{position.description}</ReactMarkdown>
            </Prose>
          )}

          {Array.isArray(position.skills) && position.skills.length > 0 && (
            <ul className="not-prose flex flex-wrap gap-1.5 pt-2 pl-9">
              {position.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <Skill>{skill}</Skill>
                </li>
              ))}
            </ul>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function Prose({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'prose prose-sm text-foreground prose-zinc dark:prose-invert max-w-none font-mono',
        'prose-a:font-medium prose-a:wrap-break-word prose-a:text-foreground prose-a:underline prose-a:underline-offset-4',
        'prose-code:rounded-md prose-code:border prose-code:bg-muted/50 prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none',
        className,
      )}
      {...props}
    />
  );
}

function Skill({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'bg-muted/50 text-muted-foreground inline-flex items-center rounded-lg border px-1.5 py-0.5 font-mono text-xs',
        className,
      )}
      {...props}
    />
  );
}
