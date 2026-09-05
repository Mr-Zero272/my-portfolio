'use client';

import { PageHeader } from '@/components/shared/page-header';
import { SessionsCard } from '../components';

export const SessionSettingsPage = () => (
  <div className="w-full max-w-2xl pb-20">
    <PageHeader
      title="Session"
      description="Review the devices signed in to your account. Revoke any session you don't recognize."
    />
    <SessionsCard />
  </div>
);
