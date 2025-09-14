import { useMusicPlayer } from '@/components/contexts/music-context';
import { Pause, Play } from '@/components/icons';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Slider } from '@/components/ui/slider';
import { cn, formatSecondsToTime } from '@/lib/utils';
import { Heart, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';

const PlayerControl = () => {
  const {
    musicBackgroundSrc,
    isPlaying,
    duration,
    progress,
    play,
    pause,
    nextTrack,
    previousTrack,
    isShuffle,
    shuffle,
    repeat,
    toggleRepeat,
    seek,
  } = useMusicPlayer();

  const handlePlayButtonClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

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
        <p className="w-10">{formatSecondsToTime(Math.round(progress))}</p>
        <Slider
          value={[progress]}
          max={duration}
          className="w-[60%]"
          onValueChange={(arrValue) => seek(Number(arrValue[0]))}
        />
        <p className="w-10">{formatSecondsToTime(Math.round(duration - progress))}</p>
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
