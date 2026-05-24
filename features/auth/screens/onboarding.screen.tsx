import AppLogo from '@/components/shared/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingForm } from '../components';

export function OnboardingScreen() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <div className="grid w-full max-w-md gap-6">
        <div className="flex justify-center">
          <AppLogo withText />
        </div>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Set up your portfolio</CardTitle>
            <CardDescription>
              Add the minimum details needed before the site can start serving your content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
