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
                <button className="block rounded-md p-1.5 hover:bg-accent">
                    <Music className="size-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96">
                <div className="mb-2 flex items-center justify-between p-5">
                    <div className="flex gap-x-2">
                        <div>
                            <Image
                                src="/images/music-bg.jpg"
                                className="size-28 rounded-xl object-cover drop-shadow-xl"
                                width={400}
                                height={400}
                                quality={100}
                                alt="music background"
                            />
                        </div>
                        <div className="py-2">
                            <h1 className="text-lg">{trackNames[currentTrackIndex] ?? 'Song name'}</h1>
                            <p className="text-muted-foreground">
                                {formatSecondsToTime(Math.round(duration - progress))}
                            </p>
                        </div>
                    </div>
                    <button className="group rounded-full bg-accent p-4">
                        {isPlaying ? (
                            <Pause className="size-5 fill-black group-active:scale-90" onClick={pause} />
                        ) : (
                            <Play className="size-5 fill-black group-active:scale-90" onClick={play} />
                        )}
                    </button>
                </div>
                <div className="flex items-center justify-center gap-x-4 p-5">
                    <button className="group rounded-full p-0.5 hover:bg-accent/40" onClick={() => previousTrack()}>
                        <SkipBack className="size-4 text-muted-foreground hover:text-black group-active:scale-90" />
                    </button>
                    <button
                        className="group rounded-full p-0.5 hover:bg-accent/40"
                        onClick={() => seek(progress - 10 < 0 ? 0 : progress - 10)}
                    >
                        <Replay10 className="size-5 text-muted-foreground hover:text-black group-active:scale-90" />
                    </button>
                    <Slider
                        value={[progress]}
                        max={duration}
                        className="h-0.5 w-[60%]"
                        onValueChange={(arrValue) => seek(Number(arrValue[0]))}
                    />
                    <button
                        className="group rounded-full p-0.5 hover:bg-accent/40"
                        onClick={() => seek(progress + 10 > duration ? duration : progress + 10)}
                    >
                        <Forward10Sharp className="size-5 text-muted-foreground hover:text-black group-active:scale-90" />
                    </button>
                    <button className="group rounded-full p-0.5 hover:bg-accent/40" onClick={() => nextTrack()}>
                        <SkipForward className="size-4 text-muted-foreground hover:text-black group-active:scale-90" />
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MusicButton;
