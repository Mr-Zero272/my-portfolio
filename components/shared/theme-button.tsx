'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Moon from '../icons/moon';
import Sun from '../icons/sun';
import { AnimatedButton } from '../ui/animated-button';

type Props = {
  className?: string;
};

const ThemeButton = ({ className = '' }: Props) => {
  const { theme, setTheme } = useTheme();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleToggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  if (!hydrated) {
    return null;
  }

  return (
    <AnimatedButton
      variant="ghost"
      className={`hover:bg-accent rounded-md p-1.5 ${className}`}
      onClick={handleToggleTheme}
      size={'icon'}
    >
      {theme && theme === 'light' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </AnimatedButton>
  );
};

export default ThemeButton;
