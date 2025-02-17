import { Metadata } from 'next';
import MusicPlayer from './music-player';

export const metadata: Metadata = {
    title: 'My favorite - @pitithuong',
    description:
        'Explore musical interests together, all you need is an mp3 file and we can enjoy music together while learning about me.',
    keywords: ['favorite', 'music', 'relax'],
    openGraph: {
        title: 'My favorite - @pitithuong',
        description:
            'Explore musical interests together, all you need is an mp3 file and we can enjoy music together while learning about me.',
        url: 'https://my-portfolio-rust-gamma-52.vercel.app/favorite',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'My favorite - @pitithuong',
        description:
            'Explore musical interests together, all you need is an mp3 file and we can enjoy music together while learning about me.',
    },
};
const FavoritePage = () => {
    return <MusicPlayer />;
};

export default FavoritePage;
