'use client';
import React, { useState } from 'react';
import ImportSongsTab from './import-songs-tab';
import { Dot, Heart, Pause, Play, Plus, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import SongItem from '@/components/ui/song-item';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/components/contexts/music-context';
import { cn, formatSecondsToTime } from '@/lib/utils';

const MusicPlayer = () => {
    const [tab, setTab] = useState<'add' | 'list'>('list');
    const {
        tracks,
        trackNames,
        currentTrackIndex,
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
        <section className="flex items-center p-5">
            <article className="flex-1 space-y-10">
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <Image
                            src="/images/music-bg.jpg"
                            className="size-96 rounded-xl object-cover drop-shadow-xl"
                            width={400}
                            height={400}
                            quality={100}
                            alt="music background"
                        />
                        <div className="group absolute right-2 top-2 cursor-pointer rounded-md p-1.5 hover:bg-accent/40">
                            <Heart className="size-6 text-muted-foreground group-hover:text-red-500 group-active:scale-90" />
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
                <div className="flex items-center justify-between px-32">
                    <button className="group rounded-md p-2 hover:bg-accent/40" onClick={shuffle}>
                        <Shuffle
                            className={cn('size-6 group-active:scale-90', {
                                'text-primary': isShuffle,
                            })}
                        />
                    </button>
                    <button className="group rounded-md p-2 hover:bg-accent/40" onClick={() => previousTrack()}>
                        <SkipBack className="size-6 fill-black group-active:scale-90" />
                    </button>
                    <button className="group rounded-full border-2 border-black p-3 hover:bg-accent/40">
                        {isPlaying ? (
                            <Pause className="size-5 fill-black group-active:scale-90" onClick={pause} />
                        ) : (
                            <Play className="size-5 fill-black group-active:scale-90" onClick={play} />
                        )}
                    </button>
                    <button className="group rounded-md p-2 hover:bg-accent/40" onClick={() => nextTrack()}>
                        <SkipForward className="size-6 fill-black group-active:scale-90" />
                    </button>
                    <button className="group rounded-md p-2 hover:bg-accent/40" onClick={toggleRepeat}>
                        <Repeat
                            className={cn('size-6 group-active:scale-90', {
                                'text-primary': repeat,
                            })}
                        />
                    </button>
                </div>
            </article>
            <article className="flex-1">
                {tab === 'list' ? (
                    <>
                        <div className="mb-5 flex items-center justify-between pl-5">
                            <div>
                                <p className="mb-1 text-4xl font-bold">
                                    List music<span className="text-primary">.</span>
                                </p>
                                <div className="flex items-center gap-x-1">
                                    <p>Design by Piti</p> <Dot /> <p>2025</p> <Dot /> <p>10 songs</p>
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
                                        <SongItem
                                            index={index}
                                            trackName={trackNames[index]}
                                            active={currentTrack === trackNames[index]}
                                        />
                                    </li>
                                ))
                            ) : (
                                <div className="ml-5 text-sm text-muted-foreground">
                                    There are no songs available at the moment, you can add a file and start listening
                                    right away.
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
