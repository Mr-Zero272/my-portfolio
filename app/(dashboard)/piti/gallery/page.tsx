import DevelopingPage from '@/components/shared/developing-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Manage and view your image gallery',
};

const GalleryPage = () => {
  return <DevelopingPage />;
};

export default GalleryPage;
