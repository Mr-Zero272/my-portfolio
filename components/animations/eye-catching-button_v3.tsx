import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
//======================================Shiny Text
export const EyeCatchingButton_v3 = ({ ...props }: ButtonProps) => {
    return (
        <Button
            {...props}
            className={cn(
                'animate-bg-shine rounded-lg border-[1px] bg-[length:250%_100%] bg-clip-text font-bold tracking-wide text-transparent shadow duration-1000 dark:text-transparent',
                'dark:border-zinc-800 dark:bg-[linear-gradient(110deg,#D4D4D8,45%,#27272A,55%,#D4D4D8)]',
                'border-zinc-300 bg-[linear-gradient(110deg,#09090B,45%,#fff,55%,#09090B)]',
                props.className,
            )}
        />
    );
};
