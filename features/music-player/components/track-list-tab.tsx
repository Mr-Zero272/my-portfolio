'use client';

import { MarqueeText } from '@/components/animations/marquee-text';
import { Button } from '@/components/ui/button';
import { Sortable, SortableContent, SortableOverlay } from '@/components/ui/sortable';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useMusicStore } from '@/stores/music-store';
import { moveElementInArray } from '@/utils/array';
import { GripVertical, ListX, Music2, Plus } from 'lucide-react';
import { TrackItem } from './track-item';

type TrackListTabProps = {
  onTabChange: (tab: 'list' | 'add') => void;
};

export const TrackListTab = ({ onTabChange }: TrackListTabProps) => {
  const tracks = useMusicStore((state) => state.tracks);
  const currentTrackIndex = useMusicStore((state) => state.currentTrackIndex);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const reorderTracks = useMusicStore((state) => state.reorderTracks);
  const clearPlaylist = useMusicStore((state) => state.clearPlaylist);
  const setTrack = useMusicStore((state) => state.setTrack);
  const removeTrack = useMusicStore((state) => state.removeTrack);

  const currentTrack = currentTrackIndex >= 0 ? tracks[currentTrackIndex] : undefined;
  const currentTitle = currentTrack?.metadata.title ?? 'Music Track';

  const handleMove = (from: number, to: number) => {
    if (from === to || to < 0 || to >= tracks.length) return;
    reorderTracks(moveElementInArray(tracks, from, to));
  };

  return (
    <div>
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="max-w-72 text-3xl font-bold">
            <MarqueeText
              text={currentTitle}
              duration={Math.max(1, Math.min(6, Math.round(currentTitle.length / 4)))}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {currentTrack?.metadata.artist ? `${currentTrack.metadata.artist} • ` : ''}
            {tracks.length} song{tracks.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tracks.length > 0 && (
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" size="icon" onClick={clearPlaylist} />}>
                <ListX />
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear playlist</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Button variant="outline" onClick={() => onTabChange('add')}>
            <Plus /> Add songs
          </Button>
        </div>
      </div>

      <Sortable
        value={tracks}
        getItemValue={(track) => track.id}
        onValueChange={reorderTracks}
        orientation="vertical"
      >
        <SortableContent className="max-h-105 space-y-1 overflow-y-auto pr-1">
          {tracks.length === 0 ? (
            <div className="rounded-lg px-3 py-10 text-center text-sm text-muted-foreground">
              If you share my taste in music, just add an mp3 file then enjoy your relaxing time while
              continuing to learn about me.
            </div>
          ) : (
            tracks.map((track, index) => (
              <TrackItem
                key={track.id}
                track={track}
                index={index}
                total={tracks.length}
                active={track.id === currentTrack?.id}
                isPlaying={isPlaying}
                onSelect={setTrack}
                onDelete={removeTrack}
                onMove={handleMove}
              />
            ))
          )}
        </SortableContent>

        <SortableOverlay>
          {({ value }) => {
            const track = tracks.find((t) => t.id === value);
            if (!track) return null;
            return (
              <div className="flex w-full items-center gap-x-3 rounded-lg border bg-background px-3 py-2 opacity-80 shadow-lg">
                <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Music2 className="size-5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {track.metadata.title}
                </span>
              </div>
            );
          }}
        </SortableOverlay>
      </Sortable>
    </div>
  );
};