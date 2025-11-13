'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { ThemeToggleButton, useThemeTransition } from '../animations/theme-toggle-button';

type Props = {
  className?: string;
};

const ThemeButton = ({ className = '' }: Props) => {
  const { setTheme, theme } = useTheme();
  const { startTransition } = useThemeTransition();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleThemeToggle = useCallback(() => {
    const newMode = theme === 'dark' ? 'light' : 'dark';

    startTransition(() => {
      setTheme(newMode);
    });
  }, [setTheme, startTransition, theme]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeToggleButton
      className={className}
      theme={theme === 'dark' ? 'light' : 'dark'}
      onClick={handleThemeToggle}
      variant="circle-blur"
      start="top-right"
    />
  );
};

export default ThemeButton;
