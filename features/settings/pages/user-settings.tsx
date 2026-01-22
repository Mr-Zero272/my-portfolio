'use client';

import { useColorContext } from '@/components/contexts/color-context';
import { Moon, Sun } from '@/components/icons';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/use-settings';
import { CircleCheck, Monitor, RefreshCcw } from 'lucide-react';
import { useTheme } from 'next-themes';

const themes = [
  { name: 'Light', icon: Sun, value: 'light', description: 'Light theme' },
  { name: 'Dark', icon: Moon, value: 'dark', description: 'Dark theme' },
  { name: 'System', icon: Monitor, value: 'system', description: 'Follow system' },
];

const colors = [
  { name: 'blue', value: 'blue', color: '#1447e6' },
  { name: 'green', value: 'green', color: '#5ea500' },
  { name: 'orange', value: 'orange', color: '#f54a00' },
  { name: 'slate', value: 'slate', color: '#171717' },
  { name: 'red', value: 'red', color: '#e7000b' },
  { name: 'rose', value: 'rose', color: '#ec003f' },
  { name: 'violet', value: 'violet', color: '#7f22fe' },
  { name: 'yellow', value: 'yellow', color: '#fdc700' },
];

const cursorStyles = [
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

const UserSettings = () => {
  const { theme, setTheme } = useTheme();
  const { currentColor, switchColor } = useColorContext();
  const {
    isTransitionPageEnabled,
    setIsTransitionPageEnabled,
    isAnimationCursorEnabled,
    setIsAnimationCursorEnabled,
    cursorStyle,
    setCursorStyle,
  } = useSettingsStore();

  const handleResetToDefault = () => {
    setTheme('system');
    switchColor('orange');
    setIsTransitionPageEnabled(true);
    setIsAnimationCursorEnabled(false);
  };

  return (
    <div className="space-y-6 pt-5">
      <Card className="border-none shadow-none">
        <CardHeader className="border-b">
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize the appearance as your favorite</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Theme Mode</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {themes.map(({ name, icon: Icon, value, description }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-4 transition-colors hover:bg-accent',
                    theme === value ? 'border-primary' : 'border-transparent',
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex w-full items-center gap-2">
              {colors.map(({ value, color }) => (
                <button
                  key={value}
                  onClick={() => switchColor(value as never)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-full border-2 p-1 transition-colors hover:bg-accent',
                    currentColor === value ? 'border-primary' : 'border-transparent',
                  )}
                >
                  <span
                    className="flex size-6 items-center justify-center rounded-full border-2 border-background"
                    style={{ backgroundColor: color }}
                  >
                    {currentColor === value && (
                      <CircleCheck
                        className="h-4 w-4 fill-white"
                        style={{
                          stroke: color,
                        }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Page Transition</Label>
              <p className="text-xs text-muted-foreground">Smooth transitions when navigating between pages</p>
            </div>
            <Switch checked={isTransitionPageEnabled} onCheckedChange={setIsTransitionPageEnabled} />
          </div>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Animation Cursor</Label>
              <p className="text-xs text-muted-foreground">Use special cursor instead of default cursor</p>
            </div>
            <Switch checked={isAnimationCursorEnabled} onCheckedChange={setIsAnimationCursorEnabled} />
          </div>
          {isAnimationCursorEnabled && (
            <div>
              <Label className="text-sm font-medium">Cursor Style</Label>
              <p className="text-xs text-muted-foreground">Choose your cursor style</p>
              <RadioGroup value={cursorStyle} onValueChange={setCursorStyle as never} className="space-y-2 py-2">
                {cursorStyles.map(({ name, icon, value }) => (
                  <div key={value} className="flex items-center gap-3">
                    <RadioGroupItem value={value} id={value} />
                    <Label className="flex items-center gap-3" htmlFor={value}>
                      <span className="text-sm">{name}</span>
                      <span>{icon}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <AnimatedButton onClick={handleResetToDefault}>
              <RefreshCcw />
              Reset to Default
            </AnimatedButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
