import { SessionSettingsPage } from '@/features/auth/pages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Session',
  description: 'Manage your active sessions',
};

const SessionSettings = () => <SessionSettingsPage />;

export default SessionSettings;
