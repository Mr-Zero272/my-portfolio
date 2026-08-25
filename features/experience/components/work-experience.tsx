'use client';

import { differenceInMonths, parse } from 'date-fns';
import { useCallback, useRef, type ComponentProps } from 'react';
// import ReactMarkdown from 'react-markdown';

import { ChevronsUpDownIcon, type ChevronsUpDownIconHandle } from '@/components/icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { BriefcaseBusinessIcon, InfinityIcon } from 'lucide-react';
import Image from 'next/image';

export type ExperiencePositionItemType = {
  /** Unique identifier for the position */
  id: string;
  /** The job title or position name */
  title: string;
  /**
   * Employment period of the position.
   * Use "MM.YYYY" or "YYYY" format. Omit `end` for current roles.
   */
  employmentPeriod: {
    /** Start date (e.g., "10.2022" or "2020"). */
    start: string;
    /** End date; leave undefined for "Present". */
    end?: string;
  };
  /** The type of employment (e.g., "Full-time", "Part-time", "Contract") */
  employmentType?: string;
  /** A brief description of the position or responsibilities */
  description?: string;
  /** An icon representing the position */
  icon?: React.ReactElement;
  /** A list of skills associated with the position */
  skills?: string[];
  /** Indicates if the position details are expanded in the UI */
  isExpanded?: boolean;
  /** Actions for edit, delete, etc. on this position */
  actions?: React.ReactNode;
};

export type ExperienceItemType = {
  /** Unique identifier for the experience item */
  id: string;
  /** Name of the company where the experience was gained */
  companyName: string;
  /** URL or path to the company's logo image */
  companyLogo?: string;
  /** URL to the company's website. */
  companyWebsite?: string;
  /**
   * List of positions held at the company
   * @fumadocsHref #experiencepositionitemtype
   * */
  positions: ExperiencePositionItemType[];
  /** Indicates if this is the user's current employer */
  isCurrentEmployer?: boolean;
};

export type WorkExperienceProps = {
  className?: string;
  /** @fumadocsHref #experienceitemtype */
  experiences: ExperienceItemType[];
};

export function WorkExperience({ className, experiences }: WorkExperienceProps) {
  return (
    <div className={cn('bg-background text-foreground px-4', className)}>
      {experiences.map((experience) => (
        <ExperienceItem key={experience.id} experience={experience} />
      ))}
    </div>
  );
}

export type ExperienceItemProps = {
  experience: ExperienceItemType;
};

export function ExperienceItem({ experience }: ExperienceItemProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="not-prose flex items-center gap-3">
        <div className="flex size-6 shrink-0 items-center justify-center">
          {experience.companyLogo ? (
            <Image
              src={experience.companyLogo}
              alt={experience.companyName}
              className="size-6 rounded-full"
              aria-hidden
              width={48}
              height={48}
            />
          ) : (
            <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          )}
        </div>

        <h3 className="text-lg leading-snug font-semibold">
          {experience.companyWebsite ? (
            <a
              className="link"
              href={experience.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
            >
              {experience.companyName}
            </a>
          ) : (
            experience.companyName
          )}
        </h3>

        {experience.isCurrentEmployer && (
          <span className="relative flex items-center justify-center" aria-label="Current Employer">
            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-sky-500 opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
          </span>
        )}
      </div>

      <div className="before:bg-border relative space-y-4 before:absolute before:left-3 before:h-full before:w-px">
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </div>
  );
}

export type ExperiencePositionItemProps = {
  position: ExperiencePositionItemType;
};

export function ExperiencePositionItem({ position }: ExperiencePositionItemProps) {
  const chevronsUpDownIconRef = useRef<ChevronsUpDownIconHandle>(null);

  const handleOpenChange = useCallback((open: boolean) => {
    const controls = chevronsUpDownIconRef.current;
    if (!controls) return;

    if (open) {
      controls.startAnimation();
    } else {
      controls.stopAnimation();
    }
  }, []);

  const { start, end } = position.employmentPeriod;
  const isOngoing = !end;
  const duration = formatDuration(start, end);

  return (
    <Collapsible
      defaultOpen={position.isExpanded}
      onOpenChange={handleOpenChange}
      disabled={!position.description}
      render={
        <div className="last:before:bg-background relative last:before:absolute last:before:h-full last:before:w-4">
          <div className="flex items-start gap-2">
            <CollapsibleTrigger
              className={cn(
                'group/experience-position not-prose block w-full text-left select-none',
                'hover:before:bg-muted/30 relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg',
                'data-disabled:before:content-none',
              )}
            >
              <div className="relative z-1 mb-1 flex items-start gap-3 text-base">
                <div
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-lg',
                    'bg-muted text-muted-foreground',
                    'border-muted-foreground/15 ring-line ring-offset-background border ring-1 ring-offset-1',
                    "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                  )}
                >
                  {position.icon ?? <BriefcaseBusinessIcon />}
                </div>

                <h4 className="text-foreground flex-1 font-medium text-balance">
                  {position.title}
                </h4>

                <div className="text-muted-foreground shrink-0 group-disabled/experience-position:hidden [&_svg]:h-lh [&_svg]:w-4">
                  <ChevronsUpDownIcon ref={chevronsUpDownIconRef} duration={0.15} />
                </div>
              </div>

              <dl className="text-muted-foreground relative z-1 flex items-center gap-2 pl-9 text-sm">
                {position.employmentType && (
                  <>
                    <div>
                      <dt className="sr-only">Employment Type</dt>
                      <dd>{position.employmentType}</dd>
                    </div>

                    <Separator
                      className="data-vertical:h-4 data-vertical:self-center"
                      orientation="vertical"
                    />
                  </>
                )}

                <div>
                  <dt className="sr-only">Employment Period</dt>
                  <dd className="flex items-center gap-0.5 tabular-nums">
                    <span>{start}</span>
                    <span className="font-mono">—</span>
                    {isOngoing ? (
                      <InfinityIcon className="size-4.5 translate-y-[0.5px]" aria-label="Present" />
                    ) : (
                      <span>{end}</span>
                    )}
                  </dd>
                </div>

                {duration && (
                  <>
                    <Separator
                      className="data-vertical:h-4 data-vertical:self-center"
                      orientation="vertical"
                    />
                    <div>
                      <dt className="sr-only">Duration</dt>
                      <dd className="tabular-nums">{duration}</dd>
                    </div>
                  </>
                )}
              </dl>
            </CollapsibleTrigger>
            <div onClick={(e) => e.stopPropagation()}>{position?.actions}</div>
          </div>

          <CollapsibleContent className="overflow-hidden">
            {position.description && (
              <Prose className="pt-2 pl-9">
                {/* <ReactMarkdown>{position.description}</ReactMarkdown> */}
                <div dangerouslySetInnerHTML={{ __html: position.description }} />
              </Prose>
            )}
          </CollapsibleContent>

          {Array.isArray(position.skills) && position.skills.length > 0 && (
            <ul className="not-prose flex flex-wrap gap-1.5 pt-3 pl-9">
              {position.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <Skill>{skill}</Skill>
                </li>
              ))}
            </ul>
          )}
        </div>
      }
    />
  );
}

function Prose({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('prose prose-ncdai prose-zinc dark:prose-invert max-w-none', className)}
      {...props}
    />
  );
}

function Skill({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'bg-muted/50 text-muted-foreground inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-xs',
        className,
      )}
      {...props}
    />
  );
}

function formatDuration(start: string, end?: string): string {
  const startHasMonth = start.includes('.');
  const endHasMonth = end ? end.includes('.') : true;

  // Both year-only: granularity is years, no month arithmetic needed.
  if (!startHasMonth && end && !endHasMonth) {
    const years = parseInt(end, 10) - parseInt(start, 10);
    if (years <= 0) {
      return '';
    }
    return `${years}y`;
  }

  const startDate = parsePeriodDate(start, 'first');
  const endDate = end ? parsePeriodDate(end, 'last') : new Date();

  // +1 to count both the start and end months inclusively.
  const totalMonths = differenceInMonths(endDate, startDate) + 1;
  if (totalMonths <= 0) {
    return '';
  }

  if (totalMonths < 12) {
    return `${totalMonths}m`;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (months === 0) {
    return `${years}y`;
  }
  return `${years}y ${months}m`;
}

function parsePeriodDate(str: string, fallbackMonth: 'first' | 'last'): Date {
  if (str.includes('.')) {
    return parse(str, 'MM.yyyy', new Date());
  }
  return parse(`${fallbackMonth === 'last' ? '12' : '01'}.${str}`, 'MM.yyyy', new Date());
}
