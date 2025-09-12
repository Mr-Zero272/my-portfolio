'use client';
import { useMusicPlayer } from '@/components/contexts/music-context';
import MarqueeText from '@/components/shared/marquee-text';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import SongItem from '@/components/ui/song-item';
import { cn, formatSecondsToTime } from '@/lib/utils';
import { Dot, Heart, Pause, Play, Plus, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import ImportSongsTab from './import-songs-tab';

const MusicPlayer = () => {
  const [tab, setTab] = useState<'add' | 'list'>('list');
  const {
    tracks,
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
    isShuffle,
    shuffle,
    repeat,
    toggleRepeat,
    seek,
  } = useMusicPlayer();
  const currentTrack = trackNames[currentTrackIndex];
  return (
    <section className="flex flex-col items-center p-1 md:p-5 lg:flex-row">
      <article className="mb-10 w-full flex-1 space-y-10 xl:mb-0">
        <div className="z-0 flex items-center justify-center">
          <div className="relative">
            <Image
              src={musicBackgroundSrc}
              className="z-0 size-72 rounded-xl object-cover drop-shadow-xl md:size-[23rem]"
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
          <button className="group hover:bg-accent/40 rounded-md p-2" onClick={shuffle}>
            <Shuffle
              className={cn('size-6 group-active:scale-90', {
                'text-primary': isShuffle,
              })}
            />
          </button>
          <button className="group hover:bg-accent/40 rounded-md p-2" onClick={() => previousTrack()}>
            <SkipBack className="size-6 fill-black group-active:scale-90 dark:fill-white" />
          </button>
          <button className="group hover:bg-accent/40 rounded-full border-2 border-black p-3 dark:border-white">
            {isPlaying ? (
              <Pause className="size-5 fill-black group-active:scale-90 dark:fill-white" onClick={pause} />
            ) : (
              <Play className="size-5 fill-black group-active:scale-90 dark:fill-white" onClick={play} />
            )}
          </button>
          <button className="group hover:bg-accent/40 rounded-md p-2" onClick={() => nextTrack()}>
            <SkipForward className="size-6 fill-black group-active:scale-90 dark:fill-white" />
          </button>
          <button className="group hover:bg-accent/40 rounded-md p-2" onClick={toggleRepeat}>
            <Repeat
              className={cn('size-6 group-active:scale-90', {
                'text-primary': repeat,
              })}
            />
          </button>
        </div>
      </article>
      <article className="w-full flex-1">
        {tab === 'list' ? (
          <>
            <div className="mb-5 flex flex-col justify-between sm:flex-row sm:items-center sm:pl-5">
              <div className="mb-2 sm:mb-0">
                <div className="mb-1 flex w-[21rem] text-4xl font-bold sm:w-96">
                  <MarqueeText
                    text={currentTrack ?? 'Music Track'}
                    duration={currentTrack ? currentTrack.length : 'Music Track'.length}
                  />
                  <span className="text-primary">.</span>
                </div>
                <div className="flex items-center gap-x-1">
                  <p>List music</p> <Dot /> <p>2025</p> <Dot /> <p>{tracks.length} songs</p>
                </div>
              </div>
              <div>
                <Button variant="outline" onClick={() => setTab('add')}>
                  <Plus /> <span>Add songs</span>
                </Button>
              </div>
            </div>
            <ul className="max-h-[700px] overflow-y-auto">
              {tracks.length !== 0 ? (
                tracks.map((track, index) => (
                  <li key={index}>
                    <SongItem index={index} trackName={trackNames[index]} active={currentTrack === trackNames[index]} />
                  </li>
                ))
              ) : (
                <div className="text-muted-foreground ml-5 text-sm">
                  If you share my taste in music, just add an mp3 file then enjoy your relaxing time while continuing to
                  learn about me.
                </div>
              )}
            </ul>
          </>
        ) : (
          <ImportSongsTab onBack={() => setTab('list')} />
        )}
      </article>
    </section>
  );
};

export default MusicPlayer;
