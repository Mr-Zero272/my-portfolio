'use client';

import { formatSecondsToTime } from '@/lib';
import { useMusicStore } from '@/store/use-music-store';
import { Music, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';
import { Forward10Sharp, Replay10 } from '../icons';
import { AnimatedButton } from '../ui/animated-button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Slider } from '../ui/slider';

const MusicButton = ({ className }: { className?: string }) => {
  const trackNames = useMusicStore((state) => state.trackNames);
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
      <DropdownMenuContent className="w-96">
        <div className="mb-2 flex items-center justify-between p-5">
          <div className="flex gap-x-2">
            <div className="w-20">
              <Image
                src={musicBackgroundSrc}
                className="h-full w-20 rounded-xl object-cover drop-shadow-xl"
                width={400}
                height={400}
                quality={100}
                alt="music background"
              />
            </div>
            <div className="flex-1 py-2">
              <h1 className="text-lg">{trackNames[currentTrackIndex] ?? 'Song name'}</h1>
              <p className="text-muted-foreground">{formatSecondsToTime(Math.round(duration - progress))}</p>
            </div>
          </div>
          <AnimatedButton
            variant="ghost"
            size="icon"
            className="bg-accent size-12 rounded-full p-4"
            onClick={handlePlayButtonClick}
          >
            {isPlaying ? (
              <Pause className="size-5 fill-black group-active:scale-90" />
            ) : (
              <Play className="size-5 fill-black group-active:scale-90" />
            )}
          </AnimatedButton>
        </div>
        <div className="flex items-center justify-center gap-x-4 p-5">
          <button className="group hover:bg-accent/40 rounded-full p-0.5" onClick={() => previousTrack()}>
            <SkipBack className="text-muted-foreground size-4 group-active:scale-90 hover:text-black dark:hover:text-white" />
          </button>
          <button
            className="group hover:bg-accent/40 rounded-full p-0.5"
            onClick={() => seek(progress - 10 < 0 ? 0 : progress - 10)}
          >
            <Replay10 className="text-muted-foreground size-5 group-active:scale-90 hover:text-black dark:hover:text-white" />
          </button>
          <Slider
            value={[progress]}
            max={duration}
            className="h-0.5 w-[60%]"
            onValueChange={(arrValue) => seek(Number(arrValue[0]))}
          />
          <button
            className="group hover:bg-accent/40 rounded-full p-0.5"
            onClick={() => seek(progress + 10 > duration ? duration : progress + 10)}
          >
            <Forward10Sharp className="text-muted-foreground size-5 group-active:scale-90 hover:text-black dark:hover:text-white" />
          </button>
          <button className="group hover:bg-accent/40 rounded-full p-0.5" onClick={() => nextTrack()}>
            <SkipForward className="text-muted-foreground size-4 group-active:scale-90 hover:text-black dark:hover:text-white" />
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MusicButton;
