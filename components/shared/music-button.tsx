'use client';

import { formatSecondsToTime } from '@/lib';
import { useMusicStore } from '@/store/use-music-store';
import { Heart, Music, Music2, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';
import { AnimatedButton } from '../ui/animated-button';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';

const MusicButton = ({ className }: { className?: string }) => {
  const tracks = useMusicStore((state) => state.tracks);
  const currentTrackIndex = useMusicStore((state) => state.currentTrackIndex);
  const musicBackgroundSrc = useMusicStore((state) => state.musicBackgroundSrc);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const duration = useMusicStore((state) => state.duration);
  const progress = useMusicStore((state) => state.progress);
  const play = useMusicStore((state) => state.play);
  const pause = useMusicStore((state) => state.pause);
  const nextTrack = useMusicStore((state) => state.nextTrack);
  const previousTrack = useMusicStore((state) => state.previousTrack);
  const seek = useMusicStore((state) => state.seek);

  const handlePlayButtonClick = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AnimatedButton size="icon" variant="ghost" className={className}>
          <Music className="size-5" />
        </AnimatedButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 space-y-3 rounded-2xl p-4 md:w-80">
        <div className="flex items-center gap-2">
          <div className="flex size-5 items-center justify-center rounded-sm bg-primary">
            <Music2 className="size-3 text-white" strokeWidth={2} />
          </div>
          <p className="text-sm text-muted-foreground">Music</p>
        </div>

        <div className="flex gap-x-2">
          <Image
            src={musicBackgroundSrc}
            className="size-10 rounded-xl object-cover drop-shadow-xl"
            width={400}
            height={400}
            quality={100}
            alt="music background"
          />
          <div className="flex-1">
            <h1 className="line-clamp-2 text-base">{tracks[currentTrackIndex]?.name || 'Song name'}</h1>
          </div>
        </div>

        <div className="flex items-center justify-start gap-x-2">
          <p className="text-muted-foreground">{formatSecondsToTime(Math.round(duration - progress))}</p>
          <AnimatedButton variant="ghost" size="icon" onClick={() => previousTrack()}>
            <SkipBack className="size-4 fill-black" />
          </AnimatedButton>

          <AnimatedButton variant="ghost" size="icon" onClick={handlePlayButtonClick}>
            {isPlaying ? (
              <Pause className="size-5 fill-black group-active:scale-90" />
            ) : (
              <Play className="size-5 fill-black group-active:scale-90" />
            )}
          </AnimatedButton>

          <AnimatedButton variant="ghost" size="icon" onClick={() => nextTrack()}>
            <SkipForward className="size-4 fill-black" />
          </AnimatedButton>

          <AnimatedButton variant="ghost" size="icon" onClick={() => nextTrack()}>
            <Checkbox icon={<Heart />} checkedIcon={<Heart className="fill-red-500 text-red-500" />} />
          </AnimatedButton>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MusicButton;
