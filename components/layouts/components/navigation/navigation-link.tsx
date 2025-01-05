'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Props {
    children: React.ReactNode;
    href: string;
    name: string;
    active?: boolean;
    onClick?: () => void;
}

const NavigationLink = ({ children, name, href, active = false, onClick = () => {} }: Props) => {
    return (
        <Link
            href={href}
            className={cn(
                'flex cursor-pointer place-items-center gap-3 overflow-clip text-clip rounded-md stroke-neutral-400 stroke-[0.75] p-1 text-neutral-400 transition-colors duration-100 hover:bg-[#f2f2f2] hover:stroke-black hover:text-black/80',
                {
                    'bg-[#f2f2f2] text-black': active,
                },
            )}
            onClick={onClick}
        >
            {children}
            <p className="font-poppins overflow-clip whitespace-nowrap tracking-wide text-inherit">{name}</p>
        </Link>
    );
};

export default NavigationLink;
