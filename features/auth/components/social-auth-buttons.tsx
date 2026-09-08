'use client';

import { GithubIcon, GoogleIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';

export type SocialProvider = 'google' | 'github';

interface SocialAuthButtonsProps {
  onProviderClick: (provider: SocialProvider) => void;
}

export const SocialAuthButtons = ({ onProviderClick }: SocialAuthButtonsProps) => {
  return (
    <>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full flex-1"
          onClick={() => onProviderClick('google')}
        >
          <GoogleIcon />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full flex-1"
          onClick={() => onProviderClick('github')}
        >
          <GithubIcon />
          Github
        </Button>
      </div>
    </>
  );
};
