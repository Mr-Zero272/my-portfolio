import { MoveDownRight } from 'lucide-react';
import { AnimatedCounter } from '../animations/animated-counter';

type Props = {
  title: string;
  content: string | number;
  sub: string;
  arrow?: boolean;
  className?: string;
};

const InfoCard = ({ title, content, sub, arrow = true, className = '' }: Props) => {
  return (
    <div className={`h-40 w-40 sm:w-44 ${className}`}>
      <div className="relative flex items-center justify-between">
        <div className="flex h-16 flex-1 items-center justify-center overflow-hidden rounded-t-3xl bg-background p-4 text-lg font-medium sm:text-2xl">
          {title}
        </div>
        {arrow ? (
          <>
            <div className="absolute top-0 right-0 size-16 bg-background"></div>
            <div className="z-1 flex size-16 items-center justify-center rounded-bl-2xl bg-slate-200/30 dark:bg-card">
              <div className="group rounded-full border border-black bg-black p-3.5 hover:cursor-pointer">
                <MoveDownRight className="size-5 text-white transition-all duration-300 ease-in-out group-hover:-rotate-90" />
              </div>
            </div>
          </>
        ) : (
          <div className="size-16"></div>
        )}
      </div>
      <div className="flex h-24 w-full items-center justify-evenly gap-x-2 rounded-tr-3xl rounded-b-3xl bg-background p-4">
        <AnimatedCounter key={sub} className="text-[2.5rem] font-semibold" to={+content} />
        <p className="text-xs">{sub}</p>
      </div>
    </div>
  );
};

export default InfoCard;
