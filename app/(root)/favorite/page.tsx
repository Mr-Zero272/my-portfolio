import { MusicPlayerPage } from '@/features/music-player/pages';
import { Metadata } from 'next';
import { env } from 'process';

export const metadata: Metadata = {
  title: 'My Favorites - Music & Interests | Phan Thanh Thuong',
  description:
    'Discover my musical interests and personal favorites. Interactive music player showcasing my personality beyond coding. Get to know me through music.',
  keywords: [
    'Thuong Phan Thanh favorites',
    'music preferences',
    'personal interests',
    'music player',
    'developer personality',
    'interactive portfolio',
    'personal side',
    'music taste',
    'relaxation',
    'hobbies',
  ],
  openGraph: {
    title: 'My Favorites - Music & Interests | Phan Thanh Thuong',
    description:
      'Discover my musical interests and personal favorites. Interactive music player showcasing my personality beyond coding. Get to know me through music.',
    url: 'https://pitithuong.vercel.app/favorite',
    type: 'website',
    images: [
      {
        url: `${env.NEXT_PUBLIC_SITE_URL}/api/og/photo?brand=pitithuong&lable=favorite&title=Phan%20Thanh%20Thuong%20Projects&logo=${env.NEXT_PUBLIC_SITE_URL}/logo.svg`,
        width: 1200,
        height: 630,
        alt: 'My Favorites | Phan Thanh Thuong',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Favorites - Music & Interests | Thuong Phan Thanh',
    description:
      'Discover my musical interests and personal favorites. Interactive music player showcasing my personality beyond coding. Get to know me through music.',
    images: [`${env.NEXT_PUBLIC_SITE_URL}/api/og/photo?brand=pitithuong&lable=favorite&title=Phan%20Thanh%20Thuong%20Projects&logo=${env.NEXT_PUBLIC_SITE_URL}/logo.svg`],
  },
};
const FavoritePage = () => {
  return <MusicPlayerPage />;
};

export default FavoritePage;