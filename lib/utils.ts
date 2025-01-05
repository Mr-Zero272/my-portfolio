import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const createRandomTransId = () => {
    const transID = Math.floor(Math.random() * 1000000);
    return `${format(new Date(), 'yyMMdd')}_${transID}`;
};
