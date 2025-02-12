import { ChevronDown, ChevronUp, Ellipsis, EllipsisVertical, Play, Trash } from 'lucide-react';
import React from 'react';
import { MusicPlaying } from '../icons';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from './dropdown-menu';

type Props = {
    active?: boolean;
};

const SongItem = ({ active = false }: Props) => {
    return (
        <div
            className={cn('group flex cursor-pointer items-center justify-between rounded-lg px-5 py-3', {
                'bg-black text-white dark:bg-white dark:text-black': active,
            })}
        >
            <div className="flex items-center gap-x-3">
                <div className="flex size-5 items-center justify-center">
                    <p className="group-hover:hidden">1</p>
                    <Play
                        className={cn('hidden size-5 fill-black group-hover:block dark:fill-white', {
                            'fill-white dark:fill-black': active,
                        })}
                    />
                </div>
                <div>
                    <h2 className="capitalize">Let&apos;s See What The Night Can Do</h2>
                </div>
            </div>
            <div className="flex items-center gap-x-2">
                {active && <MusicPlaying className="size-5" />}
                <p>4:01</p>
                <DropdownMenu>
                    <DropdownMenuTrigger className="size-7" asChild>
                        <button className="flex items-center justify-between rounded-full p-1.5 hover:bg-accent/50">
                            <EllipsisVertical className="size-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <span>Move Up</span>
                            <DropdownMenuShortcut>
                                <ChevronUp className="size-5" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Move Down</span>{' '}
                            <DropdownMenuShortcut>
                                <ChevronDown className="size-5" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Delete</span>
                            <DropdownMenuShortcut>
                                <Trash className="size-5" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default SongItem;
