import { Play } from '@/components/icons';
import DragNDrop from '@/components/shared/drag-n-drop';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import SongItem from '@/components/ui/song-item';
import { Dot, Heart, Plus, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import ImportSongsTab from './import-songs-tab';

type Props = {};

const FavoritePage = (props: Props) => {
    return (
        <section className="flex items-center p-5">
            <article className="flex-1 space-y-10">
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <Image
                            src="/images/music-bg.jpg"
                            className="size-96 rounded-xl object-cover drop-shadow-xl"
                            width={500}
                            height={500}
                            quality={100}
                            alt="music background"
                        />
                        <div className="group absolute right-2 top-2 cursor-pointer rounded-md p-1.5 hover:bg-accent/40">
                            <Heart className="size-6 text-muted-foreground group-hover:text-red-500 group-active:scale-90" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <Slider defaultValue={[50]} max={100} step={1} className="w-[60%]" />
                </div>
                <div className="flex items-center justify-between px-32">
                    <button className="group rounded-md p-2 hover:bg-accent/40">
                        <Shuffle className="size-6 group-active:scale-90" />
                    </button>
                    <button className="group rounded-md p-2 hover:bg-accent/40">
                        <SkipBack className="size-6 fill-black group-active:scale-90" />
                    </button>
                    <button className="group rounded-full border-2 border-black p-3 hover:bg-accent/40">
                        <Play className="size-5 fill-black group-active:scale-90" />
                    </button>
                    <button className="group rounded-md p-2 hover:bg-accent/40">
                        <SkipForward className="size-6 fill-black group-active:scale-90" />
                    </button>
                    <button className="group rounded-md p-2 hover:bg-accent/40">
                        <Repeat className="size-6 group-active:scale-90" />
                    </button>
                </div>
            </article>
            {/* <article className="flex-1">
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
                        <Button variant="outline">
                            <Plus /> <span>Add songs</span>
                        </Button>
                    </div>
                </div>
                <ul className="max-h-[700px] overflow-y-auto">
                    <li>
                        <SongItem />
                    </li>
                    <li>
                        <SongItem />
                    </li>
                    <li>
                        <SongItem active />
                    </li>
                    <li>
                        <SongItem />
                    </li>
                </ul>
            </article> */}
            <article className="flex-1">
                <ImportSongsTab />
            </article>
        </section>
    );
};

export default FavoritePage;
