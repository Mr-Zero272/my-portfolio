'use client';

import { formatSecondsToTime } from '@/lib';
import { useMusicStore } from '@/store/use-music-store';
import { ChevronUp, Music, Music2, Pause, Play, SkipBack, SkipForward, Timer } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { AudioWaveformIcon } from '../icons/audio-waveform';
import { AnimatedButton } from '../ui/animated-button';
import { Badge } from '../ui/badge';

const MusicButton = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null!);

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
  const sleepTimerTarget = useMusicStore((state) => state.sleepTimerTarget);

  const handlePlayButtonClick = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  useEffect(() => {
    if (!sleepTimerTarget) {
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = sleepTimerTarget - now;

      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerTarget]);

  const handleClickOutSide = useCallback(() => {
    setIsOpen(false);
  }, []);

  useOnClickOutside(panelRef, handleClickOutSide);

  return (
    <>
      <AnimatedButton size="icon" variant="ghost" className={className} onClick={() => setIsOpen(!isOpen)}>
        {isPlaying ? <AudioWaveformIcon className="size-5" /> : <Music className="size-5" />}
      </AnimatedButton>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Sliding Panel */}
            <motion.div
              ref={panelRef}
              initial={{ y: -100, x: '-50%', opacity: 0 }}
              animate={{ y: -50, x: '-50%', opacity: 1 }}
              exit={{ y: -100, x: '-50%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: -100, bottom: -50 }}
              dragElastic={0.05}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (info.offset.y < -20 || info.velocity.y < -200) {
                  setIsOpen(false);
                }
              }}
              className="fixed left-1/2 z-100 w-80 rounded-3xl border bg-background/95 p-4 shadow-2xl backdrop-blur-md md:w-96 dark:bg-zinc-900/95"
            >
              <div className="flex flex-col space-y-4">
                {/* Header with Close and Timer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Music2 className="size-3.5" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {isPlaying ? 'Now Playing' : 'Music'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {sleepTimerTarget && timeLeft && (
                      <Badge className="flex items-center rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-500">
                        <Timer className="size-3" />
                        <span>{timeLeft}</span>
                      </Badge>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-full p-1 transition-colors hover:bg-secondary"
                    >
                      <ChevronUp className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Cover and Info */}
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg shadow-md">
                    <Image src={musicBackgroundSrc} fill className="object-cover" alt="music background" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-lg leading-tight font-semibold tracking-tight">
                      {tracks[currentTrackIndex]?.name || 'No song is playing'}
                    </h3>
                    <div className="mt-2 flex w-full items-end justify-between">
                      {/* Progress Bar (Visual only for now matching original simple view) or just Time */}
                      {/* Original used a simple time display. I'll keep it simple but slightly better styled */}
                      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>{formatSecondsToTime(Math.round(progress))}</span>/
                        <span>{formatSecondsToTime(Math.round(duration))}</span>
                      </div>
                      {/* Controls */}
                      <div className="flex items-center justify-between gap-1">
                        <AnimatedButton variant="ghost" size="icon" className="size-10" onClick={() => previousTrack()}>
                          <SkipBack className="size-5 fill-current" />
                        </AnimatedButton>

                        <AnimatedButton
                          variant="default"
                          size="icon"
                          className="size-10 rounded-full shadow-lg hover:scale-105 active:scale-95"
                          onClick={handlePlayButtonClick}
                        >
                          {isPlaying ? (
                            <Pause className="size-5 fill-current text-white" />
                          ) : (
                            <Play className="size-5 fill-current text-white" />
                          )}
                        </AnimatedButton>

                        <AnimatedButton variant="ghost" size="icon" className="size-10" onClick={() => nextTrack()}>
                          <SkipForward className="size-5 fill-current" />
                        </AnimatedButton>

                        {/* <AnimatedButton variant="ghost" size="icon" className="size-10">
                      <Checkbox
                        icon={<Heart className="size-5" />}
                        checkedIcon={<Heart className="size-5 fill-red-500 text-red-500" />}
                      />
                    </AnimatedButton> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicButton;
