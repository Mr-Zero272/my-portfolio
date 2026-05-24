import { OnboardingScreen } from '@/features/site-settings/screens/onboarding.screen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'Complete the initial site setup.',
};

export default function OnboardingPage() {
  return <OnboardingScreen />;
}
