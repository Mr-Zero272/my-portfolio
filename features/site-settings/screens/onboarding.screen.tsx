'use client';

import AppLogo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LogoutButton } from '@/features/auth/components';
import { LogOutIcon } from 'lucide-react';
import { OnboardingForm } from '../components';

export function OnboardingScreen() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6 md:p-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <AppLogo withText />
        <h1 className="text-2xl font-bold tracking-tight">Welcome to My portfolio</h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          To get started, please fill out the form below to set up your account and portfolio.
        </p>
        <Tooltip>
          <TooltipTrigger
            render={
              <LogoutButton
                render={(props) => (
                  <Button
                    className="fixed top-5 right-5 md:top-7 md:right-7"
                    variant="ghost"
                    size="icon"
                    {...props}
                  >
                    <LogOutIcon />
                  </Button>
                )}
              />
            }
          />
          <TooltipContent>
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="w-full max-w-md">
        <OnboardingForm />
      </div>
    </div>
  );
}
