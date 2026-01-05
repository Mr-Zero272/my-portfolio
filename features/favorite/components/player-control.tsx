import { Pause, Play } from '@/components/icons';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Slider } from '@/components/ui/slider';
import { formatSecondsToTime } from '@/lib';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/use-music-store';
import { Clock, EllipsisVertical, Repeat, Shuffle, SkipBack, SkipForward, Timer } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SleepTimerDialog } from './sleep-timer-button';

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
  const sleepTimerTarget = useMusicStore((state) => state.sleepTimerTarget);
  const checkSleepTimer = useMusicStore((state) => state.checkSleepTimer);

  // Local state for slider to avoid lag
  const [localProgress, setLocalProgress] = useState(progress);
  const [isSeeking, setIsSeeking] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [openSleepTimerDialog, setOpenSleepTimerDialog] = useState(false);

  const currentProgress = isSeeking ? localProgress : progress;

  useEffect(() => {
    if (!sleepTimerTarget) {
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      if (now >= sleepTimerTarget) {
        checkSleepTimer();
        setTimeLeft(null);
      } else {
        const diff = Math.ceil((sleepTimerTarget - now) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerTarget, checkSleepTimer]);

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
        <div className="relative flex flex-1 items-center justify-center overflow-hidden">
          <Image
            src={musicBackgroundSrc}
            className={cn('z-0 size-70 rounded-full object-cover md:size-92', {
              'animate-spin animation-duration-[15s]': isPlaying,
            })}
            width={400}
            height={400}
            quality={100}
            alt="music background"
          />
          <div className="group absolute top-2 right-2 cursor-pointer rounded-md p-1.5 hover:bg-accent/40">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AnimatedButton variant="ghost" size="icon">
                  <EllipsisVertical />
                </AnimatedButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setOpenSleepTimerDialog(true)}>
                  <Clock />
                  <span>Set Sleep Timer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Sleep Timer Display */}
          {timeLeft && (
            <Badge className="absolute right-0 bottom-0 flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary backdrop-blur-sm xl:right-22">
              <Timer />
              <span>{timeLeft}</span>
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-4">
        <p className="w-10">{formatSecondsToTime(Math.round(currentProgress))}</p>
        <Slider
          value={[currentProgress]}
          max={duration}
          className="w-[60%]"
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
        />
        <p className="w-10">{formatSecondsToTime(Math.round(duration - currentProgress))}</p>
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
          className="group size-12 rounded-full border-2 border-black p-3 hover:bg-accent/40 dark:border-white"
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

      {/* sleep timer dialog */}
      <SleepTimerDialog open={openSleepTimerDialog} onOpenChange={setOpenSleepTimerDialog} />
    </article>
  );
};

export default PlayerControl;
