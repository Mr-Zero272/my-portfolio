'use client';

import { useCurrentTrack, useIsPlaying } from '@/stores/music-store';
import { Music2, Play } from 'lucide-react';
import { useState } from 'react';
import { ImportSongsTab } from '../components/import-songs-tab';
import { TrackListTab } from '../components/track-list-tab';

type View = 'list' | 'add';

export const MusicPlayerPage = () => {
  const [view, setView] = useState<View>('list');

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-24">
        <NowPlayingCard />
        <section className="rounded-2xl border bg-card p-4 sm:p-5">
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
      <div className="flex items-center gap-x-4 rounded-2xl border bg-card p-4 sm:p-5">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Music2 className="size-7" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Now playing</p>
          <p className="text-lg font-semibold">No song selected</p>
          <p className="text-sm text-muted-foreground">
            Import some audio files below to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-x-4 rounded-2xl border bg-card p-4 sm:p-5">
      {/* Cover art or fallback */}
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
        {track.metadata.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob object URL from embedded art
          <img src={track.metadata.cover} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <Music2 className="size-6" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {isPlaying ? 'Playing' : 'Selected'}
        </p>
        <p className="truncate text-lg font-semibold">{track.metadata.title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {track.metadata.artist ?? 'Unknown artist'}
        </p>
      </div>
      {isPlaying && <Play className="size-5 shrink-0 fill-foreground text-foreground" />}
    </div>
  );
}