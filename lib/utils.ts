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

export const formatArray = <T>(arr: Array<T>) => {
    if (arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    return `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}.`;
};
