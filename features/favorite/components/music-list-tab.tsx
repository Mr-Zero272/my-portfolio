import MarqueeText from '@/components/shared/marquee-text';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Sortable } from '@/components/ui/sortable';
import { useMusicStore } from '@/store/use-music-store';
import { Dot, Plus } from 'lucide-react';
import { useMemo } from 'react';
import SongItem from './song-item';

type MusicListTabProps = {
  onSetTab: (tab: 'add' | 'list') => void;
};

const MusicListTab = ({ onSetTab }: MusicListTabProps) => {
  const tracks = useMusicStore((state) => state.tracks);
  const currentTrackIndex = useMusicStore((state) => state.currentTrackIndex);
  const setTracks = useMusicStore((state) => state.setTracks);
  const reorderTracks = useMusicStore((state) => state.reorderTracks);

  const currentTrack = useMemo(() => tracks[currentTrackIndex], [tracks, currentTrackIndex]);

  console.log({
    tracks,
  });

  return (
    <div>
      <div className="mb-5 flex flex-col justify-between sm:flex-row sm:items-center sm:pl-5">
        <div className="mb-2 sm:mb-0">
          <div className="mb-1 flex w-84 text-4xl font-bold sm:w-96">
            <MarqueeText
              text={currentTrack?.name ?? 'Music Track'}
              duration={currentTrack?.name ? currentTrack.name.length : 'Music Track'.length}
            />
            <span className="text-primary">.</span>
          </div>
          <div className="flex items-center gap-x-1">
            <p>List music</p> <Dot /> <p>2025</p> <Dot /> <p>{tracks.length} songs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tracks.length > 0 && (
            <AnimatedButton
              variant="outline"
              className="border-destructive text-destructive hover:text-destructive"
              onClick={() => {
                setTracks([]);
              }}
            >
              Clear list
            </AnimatedButton>
          )}
          <AnimatedButton variant="outline" onClick={() => onSetTab('add')}>
            <Plus /> <span>Add songs</span>
          </AnimatedButton>
        </div>
      </div>
      <Sortable
        value={tracks}
        onValueChange={reorderTracks}
        getItemValue={(item) => item.id}
        strategy="vertical"
        className="max-h-[700px] overflow-y-auto"
      >
        {tracks.length !== 0 ? (
          tracks.map((track, index) => (
            <SongItem
              key={track.id}
              index={index}
              track={track}
              active={currentTrack?.id === track.id}
              value={track.id}
            />
          ))
        ) : (
          <div className="ml-5 text-sm text-muted-foreground">
            If you share my taste in music, just add an mp3 file then enjoy your relaxing time while continuing to learn
            about me.
          </div>
        )}
      </Sortable>
    </div>
  );
};

export default MusicListTab;
