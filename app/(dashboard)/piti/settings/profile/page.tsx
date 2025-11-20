import { ProfileSettingsForm } from '@/features/dashboard-settings/components/profile-settings-form';

export const metadata = {
  title: 'Profile Settings | Dashboard',
  description: 'Update your profile information',
};

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your profile information and personal details</p>
      </div>

      <ProfileSettingsForm />
    </div>
  );
}
