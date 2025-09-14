'use client';

import { useState } from 'react';
import ImportSongsTab from './components/import-songs-tab';
import MusicListTab from './components/music-list-tab';
import PlayerControl from './components/player-control';

const FavoriteFeature = () => {
  const [tab, setTab] = useState<'add' | 'list'>('list');

  return (
    <section className="flex flex-col items-center p-1 md:p-5 lg:flex-row">
      <PlayerControl />
      <article className="w-full flex-1">
        {tab === 'list' ? <MusicListTab onSetTab={setTab} /> : <ImportSongsTab onBack={() => setTab('list')} />}
      </article>
    </section>
  );
};

export default FavoriteFeature;
