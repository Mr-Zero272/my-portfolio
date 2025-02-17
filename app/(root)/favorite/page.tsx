import { Metadata } from 'next';
import MusicPlayer from './music-player';

export const metadata: Metadata = {
    title: 'My favorite - @pitithuong',
    description:
        'Because I love listening to music so if you are like me add some music and listen to it while continuing to learn about me.',
};
const FavoritePage = () => {
    return <MusicPlayer />;
};

export default FavoritePage;
