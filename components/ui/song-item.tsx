'use client';

import { cn, formatSecondsToTime } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp, EllipsisVertical, Play, SquarePen, Trash, X } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import { useMusicPlayer } from '../contexts/music-context';
import { MusicPlaying } from '../icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Input } from './input';

type Props = {
  trackName: string;
  index: number;
  active?: boolean;
};

const SongItem = ({ index, trackName, active = false }: Props) => {
  const {
    isPlaying,
    progress,
    tracks,
    duration,
    deleteTrack,
    currentTrackIndex,
    updateTrackPosition,
    setTrack,
    trackNames,
    updateTrackName,
    updateEditingTrackNameState,
  } = useMusicPlayer();
  const [currentTrackName, setCurrentTrackName] = useState(() => trackNames[index]);
  const [isEditing, setIsEditing] = useState(false);
  const inputEditRef = useRef<HTMLInputElement>(null);

  const handleUpdateTrackName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTrackName(currentTrackName, index);
    setIsEditing(false);
    updateEditingTrackNameState(false);
  };

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
          <p className={cn('group-hover:hidden', { hidden: isPlaying && currentTrackIndex === index })}>{index + 1}</p>

          <Play
            className={cn('hidden size-5 fill-black group-hover:block dark:fill-white', {
              'fill-white dark:fill-black': active,
              block: isPlaying && currentTrackIndex === index,
            })}
          />
        </div>
        <div>
          {isEditing ? (
            <form className="flex w-full items-center justify-between gap-x-2" onSubmit={handleUpdateTrackName}>
              <Input
                ref={inputEditRef}
                className="no-focus h-7 rounded-none border-transparent border-b-green-700 bg-transparent px-0 outline-none focus:border-b-green-500"
                type="text"
                value={currentTrackName}
                onChange={(e) => setCurrentTrackName(e.target.value)}
                placeholder="New track name"
              />
              <div className="flex items-center">
                <button type="submit" className="hover:bg-accent rounded-md p-1">
                  <Check className="size-4 text-green-500" />
                </button>
                <button
                  className="hover:bg-accent rounded-md p-1"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(false);
                    updateEditingTrackNameState(false);
                  }}
                >
                  <X className="text-destructive size-4" />
                </button>
              </div>
            </form>
          ) : (
            <h2 className="max-w-32 overflow-hidden text-nowrap text-ellipsis capitalize sm:max-w-65 md:max-w-72 lg:max-w-96">
              {trackName}
            </h2>
          )}
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        {active && isPlaying && currentTrackIndex === index && <MusicPlaying className="size-5" />}
        {currentTrackIndex === index && <p className="w-10">{formatSecondsToTime(Math.round(duration - progress))}</p>}
        <DropdownMenu>
          <DropdownMenuTrigger className="size-7" asChild>
            <button className="hover:bg-accent/50 flex items-center justify-between rounded-full p-1.5">
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
            <DropdownMenuItem disabled={index + 1 >= tracks.length} onClick={() => handleMove(index, index + 1)}>
              <span>Move Down</span>
              <DropdownMenuShortcut>
                <ChevronDown className="size-5" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (inputEditRef.current) {
                  inputEditRef.current.focus();
                }
                setIsEditing(true);
                updateEditingTrackNameState(true);
              }}
              disabled={isEditing}
            >
              <span>Edit name</span>
              <DropdownMenuShortcut>
                <SquarePen className="size-5" />
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
