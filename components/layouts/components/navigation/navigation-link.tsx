'use client';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  href: string;
  name: string;
  isCollapsed?: boolean;
  isHidden?: boolean;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const NavigationLink = ({
  name,
  href,
  isCollapsed = false,
  isHidden = false,
  active = false,
  onClick = () => {},
  icon,
}: Props) => {
  if (!isCollapsed && !isHidden) {
    return (
      <Link
        href={href}
        className={cn(
          'flex w-full cursor-pointer place-items-center gap-3 overflow-clip rounded-md stroke-neutral-400 stroke-[0.75] p-1 text-clip text-neutral-400 transition-colors duration-100 hover:bg-[#f2f2f2] hover:stroke-black hover:text-black/80',
          {
            'bg-primary text-white hover:bg-primary hover:text-white': active,
          },
        )}
        onClick={onClick}
      >
        {icon}
        {!isCollapsed && (
          <p className="font-poppins overflow-clip tracking-wide whitespace-nowrap text-inherit">{name}</p>
        )}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'flex size-11 cursor-pointer place-items-center items-center justify-center gap-3 overflow-clip rounded-full stroke-neutral-400 stroke-[0.75] p-1 text-clip text-neutral-400 transition-colors duration-100 hover:bg-[#f2f2f2] hover:stroke-black hover:text-black/80',
            {
              'bg-primary text-white hover:bg-primary hover:text-white': active,
            },
          )}
          onClick={onClick}
        >
          {icon}
          {!isCollapsed && (
            <p className="font-poppins overflow-clip tracking-wide whitespace-nowrap text-inherit">{name}</p>
          )}
        </Link>
      </TooltipTrigger>

      <TooltipContent side="right">
        <p className="text-sm">{name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default NavigationLink;
