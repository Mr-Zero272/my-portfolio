import { AccountSettingsPage } from '@/features/auth/pages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your account information',
};

const AccountSettings = () => <AccountSettingsPage />;

export default AccountSettings;
