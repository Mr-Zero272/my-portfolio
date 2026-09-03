'use client';

import { useCurrentTrack, useIsPlaying } from '@/stores/music-store';
import { Music2, Play } from 'lucide-react';
import { useState } from 'react';
import { PlayerControl } from '../components';
import { ImportSongsTab } from '../components/import-songs-tab';
import { TrackListTab } from '../components/track-list-tab';

type View = 'list' | 'add';

export const MusicPlayerPage = () => {
  const [view, setView] = useState<View>('list');

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-4 p-1 md:gap-10 md:p-5 lg:flex-row">
        <PlayerControl />
        <section className="w-full flex-1">
          {view === 'add' ? (
            <ImportSongsTab onBack={() => setView('list')} />
          ) : (
            <TrackListTab onTabChange={setView} />
          )}
        </section>
      </div>
    </div>
  );
};

function NowPlayingCard() {
  const { track } = useCurrentTrack();
  const isPlaying = useIsPlaying();

  if (!track) {
    return (
      <div className="bg-card flex items-center gap-x-4 rounded-2xl border p-4 sm:p-5">
        <div className="bg-muted text-muted-foreground flex size-16 shrink-0 items-center justify-center rounded-xl">
          <Music2 className="size-7" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">Now playing</p>
          <p className="text-lg font-semibold">No song selected</p>
          <p className="text-muted-foreground text-sm">
            Import some audio files below to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card flex items-center gap-x-4 rounded-2xl border p-4 sm:p-5">
      {/* Cover art or fallback */}
      <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-xl">
        {track.metadata.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob object URL from embedded art
          <img src={track.metadata.cover} alt="" className="size-full object-cover" />
        ) : (
          <span className="text-muted-foreground flex size-full items-center justify-center">
            <Music2 className="size-6" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          {isPlaying ? 'Playing' : 'Selected'}
        </p>
        <p className="truncate text-lg font-semibold">{track.metadata.title}</p>
        <p className="text-muted-foreground truncate text-sm">
          {track.metadata.artist ?? 'Unknown artist'}
        </p>
      </div>
      {isPlaying && <Play className="fill-foreground text-foreground size-5 shrink-0" />}
    </div>
  );
}
