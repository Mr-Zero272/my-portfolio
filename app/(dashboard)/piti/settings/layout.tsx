import { DashboardSettingsFeature } from '@/features/dashboard-settings';

export default function DashboardSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardSettingsFeature />
      <div className="mt-8">{children}</div>
    </div>
  );
}
