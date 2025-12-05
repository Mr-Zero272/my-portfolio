'use client';

import { Button } from '@/components/ui/button';
import { SortableItem, SortableItemHandle } from '@/components/ui/sortable';
import { formatSecondsToTime } from '@/lib';
import { cn } from '@/lib/utils';
import { Track, useMusicStore } from '@/store/use-music-store';
import { Check, ChevronDown, ChevronUp, EllipsisVertical, GripVertical, Play, SquarePen, Trash, X } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import { MusicPlaying } from '../../../components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/input';

type Props = {
  track: Track;
  index: number;
  active?: boolean;
  value: string;
};

const SongItem = ({ index, track, active = false, value }: Props) => {
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const progress = useMusicStore((state) => state.progress);
  const tracks = useMusicStore((state) => state.tracks);
  const duration = useMusicStore((state) => state.duration);
  const deleteTrack = useMusicStore((state) => state.deleteTrack);
  const currentTrackIndex = useMusicStore((state) => state.currentTrackIndex);
  const updateTrackPosition = useMusicStore((state) => state.updateTrackPosition);
  const setTrack = useMusicStore((state) => state.setTrack);
  const updateTrackName = useMusicStore((state) => state.updateTrackName);
  const updateEditingTrackNameState = useMusicStore((state) => state.updateEditingTrackNameState);

  const [currentTrackName, setCurrentTrackName] = useState(() => track.name);
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
    <SortableItem
      value={value}
      className={cn('group flex cursor-pointer items-center justify-between rounded-lg px-5 py-3', {
        'bg-black text-white dark:bg-white dark:text-black': active,
      })}
    >
      <div className="flex flex-1 items-center gap-x-3">
        <SortableItemHandle
          className={cn('text-muted-foreground hover:text-foreground', {
            'hover:text-white dark:hover:text-black': active,
          })}
        >
          <GripVertical className="h-4 w-4" />
        </SortableItemHandle>
        <div className="flex size-5 items-center justify-center" onClick={() => setTrack(index)}>
          <p className={cn('group-hover:hidden', { hidden: isPlaying && currentTrackIndex === index })}>{index + 1}</p>

          <Play
            className={cn('hidden size-5 fill-black group-hover:block dark:fill-white', {
              'fill-white dark:fill-black': active,
              block: isPlaying && currentTrackIndex === index,
            })}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          {isEditing ? (
            <form className="flex w-full items-center justify-between gap-x-2" onSubmit={handleUpdateTrackName}>
              <Input
                ref={inputEditRef}
                className="h-7 w-full flex-1 rounded-none border-transparent border-b-green-700 bg-transparent px-0 outline-none focus:border-b-green-500 focus-visible:border-x-transparent focus-visible:border-t-transparent focus-visible:ring-0"
                type="text"
                value={currentTrackName}
                onChange={(e) => setCurrentTrackName(e.target.value)}
                placeholder="New track name"
              />
              <div className="flex items-center">
                <button type="submit" className="rounded-md p-1 hover:bg-accent">
                  <Check className="size-4 text-green-500" />
                </button>
                <button
                  className="rounded-md p-1 hover:bg-accent"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(false);
                    updateEditingTrackNameState(false);
                  }}
                >
                  <X className="size-4 text-destructive" />
                </button>
              </div>
            </form>
          ) : (
            <h2 className="line-clamp-1 capitalize">{track.name}</h2>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-2">
        {active && isPlaying && currentTrackIndex === index && <MusicPlaying className="size-5" />}
        {currentTrackIndex === index && <p className="w-10">{formatSecondsToTime(Math.round(duration - progress))}</p>}
        <DropdownMenu>
          <DropdownMenuTrigger className="size-7" asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
    </SortableItem>
  );
};

export default SongItem;
