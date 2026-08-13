'use client';

import { useTheme } from 'next-themes';
import { PullCord } from 'pullcord';
import 'pullcord/pullcord.css';

export const PullCordToggleTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <PullCord
      onPull={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      pulled={theme === 'dark'}
      ariaLabel="Toggle theme"
    />
  );
};
