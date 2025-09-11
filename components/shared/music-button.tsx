'use client';

import { formatSecondsToTime } from '@/lib/utils';
import { Music, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { useMusicPlayer } from '../contexts/music-context';
import { Forward10Sharp, Replay10 } from '../icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Slider } from '../ui/slider';

const MusicButton = () => {
  const {
    trackNames,
    currentTrackIndex,
    musicBackgroundSrc,
    isPlaying,
    duration,
    progress,
    play,
    pause,
    nextTrack,
    previousTrack,
    seek,
  } = useMusicPlayer();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-accent block rounded-md p-1.5">
          <Music className="size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96">
        <div className="mb-2 flex items-center justify-between p-5">
          <div className="flex gap-x-2">
            <div>
              <Image
                src={musicBackgroundSrc}
                className="size-28 rounded-xl object-cover drop-shadow-xl"
                width={400}
                height={400}
                quality={100}
                alt="music background"
              />
            </div>
            <div className="py-2">
              <h1 className="text-lg">{trackNames[currentTrackIndex] ?? 'Song name'}</h1>
              <p className="text-muted-foreground">{formatSecondsToTime(Math.round(duration - progress))}</p>
            </div>
          </div>
          <button className="group bg-accent rounded-full p-4">
            {isPlaying ? (
              <Pause className="size-5 fill-black group-active:scale-90" onClick={pause} />
            ) : (
              <Play className="size-5 fill-black group-active:scale-90" onClick={play} />
            )}
          </button>
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
