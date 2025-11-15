'use client';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Blocks, Palette, Shield, User2 } from 'lucide-react';
import { useState } from 'react';
import { AccountSettings } from './components/account-settings';
import { AppearanceSettings } from './components/appearance-settings';
import { GeneralSettings } from './components/general-settings';
import { NotificationSettings } from './components/notification-settings';
import { SecuritySettings } from './components/security-settings';

export default function DashboardSettingsFeature() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your dashboard preferences and account settings
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex w-full flex-row items-start justify-center gap-4"
      >
        <TabsList className="bg-background grid shrink-0 grid-cols-1 gap-1 p-0">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start px-3 py-1.5"
          >
            <Blocks />
            General
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start px-3 py-1.5"
          >
            <User2 />
            Account
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start px-3 py-1.5"
          >
            <Shield />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start px-3 py-1.5"
          >
            <Bell />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start px-3 py-1.5"
          >
            <Palette />
            Appearance
          </TabsTrigger>
        </TabsList>

        <Separator orientation="vertical" className="data-[orientation=vertical]:h-96" />

        <div className="w-full">
          <TabsContent value="general" className="space-y-4">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <AppearanceSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
