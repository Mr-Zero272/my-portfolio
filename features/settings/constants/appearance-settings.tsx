import { Moon, Sun } from '@/components/icons';
import { Monitor } from 'lucide-react';

export const themes = [
  { name: 'Light', icon: Sun, value: 'light', description: 'Light theme' },
  { name: 'Dark', icon: Moon, value: 'dark', description: 'Dark theme' },
  { name: 'System', icon: Monitor, value: 'system', description: 'Follow system' },
];

export const colors = [
  { name: 'blue', value: 'blue', color: '#1447e6' },
  { name: 'green', value: 'green', color: '#5ea500' },
  { name: 'orange', value: 'orange', color: '#f54a00' },
  { name: 'slate', value: 'slate', color: '#171717' },
  { name: 'red', value: 'red', color: '#e7000b' },
  { name: 'rose', value: 'rose', color: '#ec003f' },
  { name: 'violet', value: 'violet', color: '#7f22fe' },
  { name: 'yellow', value: 'yellow', color: '#fdc700' },
];

export const cursorStyles = [
  {
    name: 'Default',
    value: 'default',
    icon: (
      <div className="flex size-6 items-center justify-center rounded-full border-2 border-primary">
        <div className="size-3 rounded-full bg-primary" />
      </div>
    ),
  },
  {
    name: 'Geometric',
    value: 'geometric',
    icon: (
      <div className="flex size-6 rotate-45 items-center justify-center border-2 border-primary">
        <div className="size-3 bg-primary" />
      </div>
    ),
  },
  {
    name: 'Glow',
    value: 'glow',
    icon: (
      <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
        <div className="size-3 rounded-full bg-primary" />
      </div>
    ),
  },
];
