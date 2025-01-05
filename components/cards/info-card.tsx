import { MoveDownRight } from 'lucide-react';
import React from 'react';
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
        <div className={`h-40 w-44 ${className}`}>
            <div className="relative flex items-center justify-between">
                <div className="flex h-16 flex-1 items-center justify-center overflow-hidden rounded-t-3xl bg-white p-4 text-2xl">
                    {title}
                </div>
                {arrow ? (
                    <>
                        <div className="absolute right-0 top-0 size-16 bg-white"></div>
                        <div className="z-[1] flex size-16 items-center justify-center rounded-bl-2xl bg-slate-200/30">
                            <div className="group rounded-full border border-black bg-black p-3.5 hover:cursor-pointer">
                                <MoveDownRight className="size-5 text-white transition-all duration-300 ease-in-out group-hover:-rotate-90" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="size-16"></div>
                )}
            </div>
            <div className="flex h-[6rem] w-full items-center justify-between gap-x-2 rounded-b-3xl rounded-tr-3xl bg-white p-4">
                <AnimatedCounter key={sub} className="text-[2.5rem] font-semibold" to={+content} />
                <p className="text-xs">{sub}</p>
            </div>
        </div>
    );
};

export default InfoCard;
