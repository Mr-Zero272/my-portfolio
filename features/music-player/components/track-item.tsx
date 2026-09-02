'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortableItem, SortableItemHandle } from '@/components/ui/sortable';
import type { Track } from '@/features/music-player/types/music';
import { cn } from '@/lib/utils';
import { formatSecondsToTime } from '@/utils/format';
import {
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  GripVertical,
  Music2,
  Play,
  Trash2,
} from 'lucide-react';

type TrackItemProps = {
  track: Track;
  index: number;
  total: number;
  /** Whether this row is the currently selected/playing track. */
  active: boolean;
  /** Global playing flag — used to render the "playing" icon on the active row. */
  isPlaying: boolean;
  onSelect: (index: number) => void;
  onDelete: (trackId: string) => void;
  onMove: (from: number, to: number) => void;
};

export const TrackItem = ({
  track,
  index,
  total,
  active,
  isPlaying,
  onSelect,
  onDelete,
  onMove,
}: TrackItemProps) => {
  const { metadata } = track;
  const isCurrentAndPlaying = active && isPlaying;
  const durationLabel = track.duration > 0 ? formatSecondsToTime(Math.round(track.duration)) : '';

  return (
    <SortableItem
      value={track.id}
      className={cn(
        'group flex cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2 hover:bg-accent/40',
        active && 'bg-accent/60 hover:bg-accent/60',
      )}
    >
      <SortableItemHandle
        aria-label="Drag to reorder"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <GripVertical className="size-4" />
      </SortableItemHandle>

      {/* Play / index toggle */}
      <button
        type="button"
        aria-label={isCurrentAndPlaying ? `Pause ${metadata.title}` : `Play ${metadata.title}`}
        onClick={() => onSelect(index)}
        className="flex size-5 shrink-0 items-center justify-center"
      >
        {isCurrentAndPlaying ? (
          <Play className="size-4 fill-foreground text-foreground" />
        ) : (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <Play className="hidden size-4 group-hover:block" />
          </>
        )}
      </button>

      {/* Cover art or fallback icon */}
      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
        {metadata.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob object URL from embedded art
          <img src={metadata.cover} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <Music2 className="size-5" />
          </span>
        )}
      </div>

      {/* Title / artist */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{metadata.title}</p>
        {metadata.artist && (
          <p className="truncate text-xs text-muted-foreground">{metadata.artist}</p>
        )}
      </div>

      {durationLabel && (
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{durationLabel}</span>
      )}

      {/* Row actions */}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={index === 0} onClick={() => onMove(index, index - 1)}>
            <ChevronUp /> Move Up
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
          >
            <ChevronDown /> Move Down
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(track.id)}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SortableItem>
  );
};
