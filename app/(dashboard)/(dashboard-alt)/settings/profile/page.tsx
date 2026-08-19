import { ProfileFormPage } from '@/features/profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile page',
};

const ProfilePage = () => {
  return <ProfileFormPage />;
};

export default ProfilePage;
