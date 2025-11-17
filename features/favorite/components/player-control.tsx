import { Pause, Play } from '@/components/icons';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Slider } from '@/components/ui/slider';
import { formatSecondsToTime } from '@/lib';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/use-music-store';
import { Heart, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

const PlayerControl = () => {
  const musicBackgroundSrc = useMusicStore((state) => state.musicBackgroundSrc);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const duration = useMusicStore((state) => state.duration);
  const progress = useMusicStore((state) => state.progress);
  const play = useMusicStore((state) => state.play);
  const pause = useMusicStore((state) => state.pause);
  const nextTrack = useMusicStore((state) => state.nextTrack);
  const previousTrack = useMusicStore((state) => state.previousTrack);
  const isShuffle = useMusicStore((state) => state.isShuffle);
  const shuffle = useMusicStore((state) => state.shuffle);
  const repeat = useMusicStore((state) => state.repeat);
  const toggleRepeat = useMusicStore((state) => state.toggleRepeat);
  const seek = useMusicStore((state) => state.seek);

  // Local state for slider to avoid lag
  const [localProgress, setLocalProgress] = useState(progress);
  const [isSeeking, setIsSeeking] = useState(false);

  // Sync local progress with store progress when not seeking
  useEffect(() => {
    if (!isSeeking) {
      setLocalProgress(progress);
    }
  }, [progress, isSeeking]);

  const handlePlayButtonClick = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const handleSliderChange = useCallback((arrValue: number[]) => {
    setIsSeeking(true);
    setLocalProgress(arrValue[0]);
  }, []);

  const handleSliderCommit = useCallback(
    (arrValue: number[]) => {
      seek(arrValue[0]);
      setIsSeeking(false);
    },
    [seek],
  );

  return (
    <article className="mb-10 w-full flex-1 space-y-10 xl:mb-0">
      <div className="z-0 flex items-center justify-center">
        <div className="relative">
          <Image
            src={musicBackgroundSrc}
            className={cn('z-0 size-72 rounded-full object-cover drop-shadow-xl md:size-[23rem]', {
              'animate-spin [animation-duration:15s]': isPlaying,
            })}
            width={400}
            height={400}
            quality={100}
            alt="music background"
          />
          <div className="group hover:bg-accent/40 absolute top-2 right-2 cursor-pointer rounded-md p-1.5">
            <Heart className="text-muted-foreground size-6 group-hover:text-red-500 group-active:scale-90" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-4">
        <p className="w-10">{formatSecondsToTime(Math.round(localProgress))}</p>
        <Slider
          value={[localProgress]}
          max={duration}
          className="w-[60%]"
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
        />
        <p className="w-10">{formatSecondsToTime(Math.round(duration - localProgress))}</p>
      </div>
      <div className="flex w-full items-center justify-between px-2 sm:px-5 md:px-10 lg:px-32">
        <AnimatedButton variant="ghost" size={'icon'} onClick={shuffle}>
          <Shuffle
            className={cn('size-6 group-active:scale-90', {
              'text-primary': isShuffle,
            })}
          />
        </AnimatedButton>
        <AnimatedButton variant="ghost" size={'icon'} onClick={previousTrack}>
          <SkipBack className="size-6 fill-black group-active:scale-90 dark:fill-white" />
        </AnimatedButton>
        <AnimatedButton
          variant="outline"
          size="icon"
          className="group hover:bg-accent/40 size-12 rounded-full border-2 border-black p-3 dark:border-white"
          onClick={handlePlayButtonClick}
        >
          {isPlaying ? (
            <Pause className="size-5 fill-black group-active:scale-90 dark:fill-white" />
          ) : (
            <Play className="size-5 fill-black group-active:scale-90 dark:fill-white" />
          )}
        </AnimatedButton>
        <AnimatedButton variant="ghost" size={'icon'} onClick={nextTrack}>
          <SkipForward className="size-6 fill-black group-active:scale-90 dark:fill-white" />
        </AnimatedButton>
        <AnimatedButton variant="ghost" size={'icon'} onClick={toggleRepeat}>
          <Repeat
            className={cn('size-6 group-active:scale-90', {
              'text-primary': repeat,
            })}
          />
        </AnimatedButton>
      </div>
    </article>
  );
};

export default PlayerControl;
