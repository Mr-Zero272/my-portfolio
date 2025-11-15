import DashboardSettingsFeature from '@/features/dashboard-settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your dashboard settings',
};

const DashboardSettingsPage = () => {
  return <DashboardSettingsFeature />;
};

export default DashboardSettingsPage;
