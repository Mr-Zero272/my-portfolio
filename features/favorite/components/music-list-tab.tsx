import MarqueeText from '@/components/shared/marquee-text';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useMusicStore } from '@/store/use-music-store';
import { Dot, Plus } from 'lucide-react';
import { useMemo } from 'react';
import SongItem from './song-item';

type MusicListTabProps = {
  onSetTab: (tab: 'add' | 'list') => void;
};

const MusicListTab = ({ onSetTab }: MusicListTabProps) => {
  const tracks = useMusicStore((state) => state.tracks);
  const trackNames = useMusicStore((state) => state.trackNames);
  const currentTrackIndex = useMusicStore((state) => state.currentTrackIndex);
  const currentTrack = useMemo(() => trackNames[currentTrackIndex], [trackNames, currentTrackIndex]);
  return (
    <div>
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
          <AnimatedButton variant="outline" onClick={() => onSetTab('add')}>
            <Plus /> <span>Add songs</span>
          </AnimatedButton>
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
            If you share my taste in music, just add an mp3 file then enjoy your relaxing time while continuing to learn
            about me.
          </div>
        )}
      </ul>
    </div>
  );
};

export default MusicListTab;
