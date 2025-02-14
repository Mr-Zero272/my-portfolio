'use client';
import { cn, formatSecondsToTime } from '@/lib/utils';
import { ChevronDown, ChevronUp, EllipsisVertical, Play, Trash } from 'lucide-react';
import { MusicPlaying } from '../icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from './dropdown-menu';
import { useMusicPlayer } from '../contexts/music-context';

type Props = {
    trackName: string;
    index: number;
    active?: boolean;
};

const SongItem = ({ index, trackName, active = false }: Props) => {
    const { isPlaying, progress, tracks, duration, deleteTrack, currentTrackIndex, updateTrackPosition, setTrack } =
        useMusicPlayer();

    const handleMove = (oldPosition: number, newPosition: number) => {
        if (oldPosition === newPosition) {
            return;
        }

        if (newPosition < 0) {
            return;
        }

        if (newPosition >= tracks.length) {
            return;
        }

        updateTrackPosition(oldPosition, newPosition);
    };
    return (
        <div
            className={cn('group flex cursor-pointer items-center justify-between rounded-lg px-5 py-3', {
                'bg-black text-white dark:bg-white dark:text-black': active,
            })}
        >
            <div className="flex items-center gap-x-3">
                <div className="flex size-5 items-center justify-center" onClick={() => setTrack(index)}>
                    <p className={cn('group-hover:hidden', { hidden: isPlaying && currentTrackIndex === index })}>
                        {index + 1}
                    </p>
                    <Play
                        className={cn('hidden size-5 fill-black group-hover:block dark:fill-white', {
                            'fill-white dark:fill-black': active,
                            block: isPlaying && currentTrackIndex === index,
                        })}
                    />
                </div>
                <div>
                    <h2 className="max-w-60 overflow-hidden text-ellipsis text-nowrap capitalize md:max-w-96">
                        {trackName}
                    </h2>
                </div>
            </div>
            <div className="flex items-center gap-x-2">
                {active && isPlaying && currentTrackIndex === index && <MusicPlaying className="size-5" />}
                {currentTrackIndex === index && (
                    <p className="w-10">{formatSecondsToTime(Math.round(duration - progress))}</p>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger className="size-7" asChild>
                        <button className="flex items-center justify-between rounded-full p-1.5 hover:bg-accent/50">
                            <EllipsisVertical className="size-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem disabled={index - 1 < 0} onClick={() => handleMove(index, index - 1)}>
                            <span>Move Up</span>
                            <DropdownMenuShortcut>
                                <ChevronUp className="size-5" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={index + 1 >= tracks.length}
                            onClick={() => handleMove(index, index + 1)}
                        >
                            <span>Move Down</span>
                            <DropdownMenuShortcut>
                                <ChevronDown className="size-5" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteTrack(index)}>
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
