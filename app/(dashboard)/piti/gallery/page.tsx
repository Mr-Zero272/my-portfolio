import GalleryFeature from '@/features/gallery';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Manage and view your image gallery',
};

const GalleryPage = () => {
  return <GalleryFeature />;
};

export default GalleryPage;
