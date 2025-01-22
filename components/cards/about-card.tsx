import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
    icon: React.FC<{ className?: string }>;
    title: string;
    sub: string;
    active?: boolean;
};

const AboutCard = ({ icon: Icon, title, sub, active = false }: Props) => {
    return (
        <div
            className={cn(
                'flex w-40 cursor-pointer flex-row items-center justify-between rounded-xl border px-3.5 py-2 transition-all duration-200 ease-in-out hover:border-primary md:w-52 md:flex-col md:items-start md:rounded-3xl md:p-4',
                { 'border-primary bg-primary text-white dark:text-gray-800 md:bg-white md:text-black': active },
            )}
        >
            <Icon className="size-6 md:size-9" />
            <p className="text-base md:my-3 md:text-lg md:font-bold">{title}</p>
            <p className="line-clamp-2 hidden text-sm text-gray-500 md:inline-block">{sub}</p>
        </div>
    );
};

export default AboutCard;
