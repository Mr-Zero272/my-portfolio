import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PauseIcon, PlayIcon, Repeat, Shuffle, SkipBack, SkipForward, Timer } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrentTrack, useMusicControls, useMusicFlags } from '@/stores/music-store';
import { formatSecondsToTime } from '@/utils/format';
import { SliderRootChangeEventDetails, SliderRootCommitEventDetails } from '@base-ui/react';
import { useWindowEvent } from '@mantine/hooks';
// import { SleepTimerDialog } from './sleep-timer-button';

const PlayerControl = () => {
  const { track: currentTrack } = useCurrentTrack();
  const { play, pause, nextTrack, previousTrack, seek, shuffle, toggleRepeat, checkSleepTimer } =
    useMusicControls();
  const { isPlaying, isShuffle, repeat, duration, progress, sleepTimerTarget } = useMusicFlags();

  // Local state for slider to avoid lag
  const [localProgress, setLocalProgress] = useState(progress);
  const [isSeeking, setIsSeeking] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

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
    // `play()` in the store creates/resumes the Howl for the current track, so a
    // single toggle works both right after an import and after pausing.
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const handleSliderChange = useCallback(
    (value: number | readonly number[], _eventDetails: SliderRootChangeEventDetails) => {
      setIsSeeking(true);
      setLocalProgress(Array.isArray(value) ? value[0] : value);
    },
    [],
  );

  const handleSliderCommit = useCallback(
    (value: number | readonly number[], _eventDetails: SliderRootCommitEventDetails) => {
      seek(Array.isArray(value) ? value[0] : value);
      setIsSeeking(false);
    },
    [seek],
  );

  const handleSpaceKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayButtonClick();
      }
    },
    [handlePlayButtonClick],
  );

  useWindowEvent('keydown', handleSpaceKeyPress);

  return (
    <article className="mb-10 w-full flex-1 space-y-10 xl:mb-0">
      <div className="z-0 flex items-center justify-center">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden">
          <Image
            unoptimized
            src={currentTrack?.metadata?.cover || '/images/music/music-bg-1.jpg'}
            className={cn('z-0 size-70 rounded-full object-cover md:size-92', {
              'animation-duration-[15s] animate-spin': isPlaying,
            })}
            width={400}
            height={400}
            alt="Music cover"
          />
          {/* <div className="group hover:bg-accent/40 absolute top-2 right-2 cursor-pointer rounded-md p-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger render={ <Button variant="ghost" size="icon" />}>
                  <EllipsisVerticalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setOpenSleepTimerDialog(true)}>
                  <Clock />
                  <span>Set Sleep Timer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}
          {/* Sleep Timer Display */}
          {timeLeft && (
            <Badge className="bg-primary/10 text-primary absolute right-0 bottom-0 flex items-center gap-1 rounded-md px-2 py-1 text-xs backdrop-blur-sm xl:right-22">
              <Timer />
              <span>{timeLeft}</span>
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-4">
        <p className="w-10">{formatSecondsToTime(Math.round(currentProgress))}</p>
        <Slider
          value={currentProgress}
          max={duration}
          className="w-[60%]"
          onValueChange={handleSliderChange}
          onValueCommitted={handleSliderCommit}
        />
        <p className="w-10">{formatSecondsToTime(Math.round(duration - currentProgress))}</p>
      </div>
      <div className="flex w-full items-center justify-between px-2 sm:px-5 md:px-10 lg:px-32">
        <Button variant="ghost" size={'icon'} onClick={shuffle}>
          <Shuffle
            className={cn('size-6 group-active:scale-90', {
              'text-primary': isShuffle,
            })}
          />
        </Button>
        <Button variant="ghost" size={'icon'} onClick={previousTrack}>
          <SkipBack className="size-6 fill-black group-active:scale-90 dark:fill-white" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="group hover:bg-accent/40 size-12 rounded-full border-2 border-black p-3 dark:border-white"
          onClick={handlePlayButtonClick}
        >
          {isPlaying ? (
            <PauseIcon className="size-5 fill-black group-active:scale-90 dark:fill-white" />
          ) : (
            <PlayIcon className="size-5 fill-black group-active:scale-90 dark:fill-white" />
          )}
        </Button>
        <Button variant="ghost" size={'icon'} onClick={nextTrack}>
          <SkipForward className="size-6 fill-black group-active:scale-90 dark:fill-white" />
        </Button>
        <Button variant="ghost" size={'icon'} onClick={toggleRepeat}>
          <Repeat
            className={cn('size-6 group-active:scale-90', {
              'text-primary': repeat,
            })}
          />
        </Button>
      </div>

      {/* sleep timer dialog */}
      {/* <SleepTimerDialog open={openSleepTimerDialog} onOpenChange={setOpenSleepTimerDialog} /> */}
    </article>
  );
};

export { PlayerControl };
