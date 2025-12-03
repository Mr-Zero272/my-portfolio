'use client';

import { THEMES } from '@/constants/theme';
import { createContext, useCallback, useContext, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

type Theme = 'blue' | 'orange' | 'green' | 'slate' | 'red' | 'rose' | 'violet' | 'yellow';

interface IColorContext {
  currentColor: Theme;
  switchColor: (color: Theme) => void;
}

const ColorContext = createContext<IColorContext>({
  currentColor: 'orange',
  switchColor: () => {},
});

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentColor, setCurrentColor] = useLocalStorage<Theme>('currentColor', 'orange');

  useEffect(() => {
    const theme = THEMES[currentColor];
    if (!theme) return;

    const styleId = 'theme-colors';
    let styleTag = document.getElementById(styleId);

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    const lightTheme = Object.entries(theme.light)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n');

    const darkTheme = Object.entries(theme.dark)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n');

    styleTag.innerHTML = `
      :root {
        ${lightTheme}
      }
      .dark {
        ${darkTheme}
      }
    `;
  }, [currentColor]);

  const switchColor = useCallback((color: Theme) => {
    setCurrentColor(color);
  }, []);

  return <ColorContext.Provider value={{ currentColor, switchColor }}>{children}</ColorContext.Provider>;
};

export const useColorContext = () => {
  return useContext(ColorContext);
};
