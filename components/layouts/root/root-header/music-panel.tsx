'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { useCurrentTrack, useMusicControls, useMusicFlags } from '@/stores/music-store';
import { Music2, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useHeaderIsland } from './header-island';

/**
 * Expanded "music" view of the header island: shows the currently playing track
 * with transport controls. When the playlist is empty it shows a placeholder
 * with a CTA that jumps to the music page (`/favorite`) to add songs.
 */
const MusicPanel = () => {
  const { track } = useCurrentTrack();
  const { play, pause, previousTrack, nextTrack } = useMusicControls();
  const { isPlaying } = useMusicFlags();
  const { setActiveView } = useHeaderIsland();

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  if (!track) {
    return (
      <div className="flex items-center gap-2 text-foreground">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <Music2 className="opacity-60" />
        </span>
        <p className="text-xs font-medium whitespace-nowrap">Nothing playing</p>
        <Link
          href="/favorite"
          onClick={() => setActiveView(null)}
          className={buttonVariants({ size: 'sm', variant: 'ghost' })}
        >
          Add songs
        </Link>
      </div>
    );
  }

  const cover = track.metadata.cover;
  const title = track.metadata.title || 'Unknown title';
  const artist = track.metadata.artist || 'Unknown artist';

  return (
    <div className="flex items-center gap-2 text-foreground">
      {cover ? (
        <Image
          unoptimized
          src={cover}
          alt=""
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <Music2 className="opacity-60" />
        </span>
      )}

      <div className="min-w-0 max-w-[7.5rem] sm:max-w-[10rem]">
        <p className="truncate text-xs leading-tight font-medium">{title}</p>
        <p className="truncate text-[0.7rem] leading-tight opacity-60">{artist}</p>
      </div>

      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Previous track"
          onClick={previousTrack}
        >
          <SkipBack />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={togglePlay}
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Next track"
          onClick={nextTrack}
        >
          <SkipForward />
        </Button>
      </div>
    </div>
  );
};

export { MusicPanel };

