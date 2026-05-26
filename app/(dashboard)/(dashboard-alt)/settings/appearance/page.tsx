import DevelopingPage from '@/components/shared/developing-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Appearance Settings',
  description: 'Manage appearance settings',
};

export default function Page() {
  return <DevelopingPage />;
}
