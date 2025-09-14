import FavoriteFeature from '@/features/favorite';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Favorites - Music & Interests | Thuong Phan Thanh',
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
    title: 'My Favorites - Music & Interests | Thuong Phan Thanh',
    description:
      'Discover my musical interests and personal favorites. Interactive music player showcasing my personality beyond coding. Get to know me through music.',
    url: 'https://pitithuong.vercel.app/favorite',
    type: 'website',
    images: [
      {
        url: '/images/projects/portfolio/my-portfolio-h-1.png',
        width: 1200,
        height: 630,
        alt: 'My Favorites - Thuong Phan Thanh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Favorites - Music & Interests | Thuong Phan Thanh',
    description:
      'Discover my musical interests and personal favorites. Interactive music player showcasing my personality beyond coding. Get to know me through music.',
    images: ['/images/projects/portfolio/my-portfolio-h-1.png'],
  },
};
const FavoritePage = () => {
  return <FavoriteFeature />;
};

export default FavoritePage;
