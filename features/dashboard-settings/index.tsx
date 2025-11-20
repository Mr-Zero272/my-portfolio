'use client';

import { Separator } from '@/components/ui/separator';
import { Bell, Blocks, Palette, Shield, User2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
// import { AccountSettings } from './components/account-settings';
// import { AppearanceSettings } from './components/appearance-settings';
// import { GeneralSettings } from './components/general-settings';
// import { NotificationSettings } from './components/notification-settings';
// import { SecuritySettings } from './components/security-settings';

const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: User2, href: '/dashboard/settings/profile' },
  { id: 'general', label: 'General', icon: Blocks, href: '/dashboard/settings/general' },
  { id: 'security', label: 'Security', icon: Shield, href: '/dashboard/settings/security' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/dashboard/settings/notifications' },
  { id: 'appearance', label: 'Appearance', icon: Palette, href: '/dashboard/settings/appearance' },
];

export function DashboardSettingsFeature() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your dashboard preferences and account settings
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar Navigation */}
        <nav className="w-full space-y-1 md:w-48">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => setActiveTab(tab.id)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <Separator orientation="vertical" className="hidden h-auto md:block" />

        {/* Content Area */}
        <div className="flex-1">{/* Content will be rendered by nested routes */}</div>
      </div>
    </div>
  );
}

export default DashboardSettingsFeature;
