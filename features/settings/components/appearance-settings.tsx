'use client';

import { useColorContext } from '@/components/contexts/color-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/use-settings';
import { CircleCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import { colors, cursorStyles, themes } from '../constants/appearance-settings';

export function AppearanceSettings() {
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

  return (
    <div className="max-w-7xl space-y-6 md:pr-10">
      <Card className="border-none shadow-none">
        <CardHeader className="border-b">
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize the appearance of your dashboard</CardDescription>
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
                    className="flex size-6 items-center justify-center rounded-full"
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
            <div className="flex items-center gap-4">
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
              <Switch checked={isAnimationCursorEnabled} onCheckedChange={setIsAnimationCursorEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Adjust how content is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="font-size">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Show Sidebar</Label>
              <p className="text-xs text-muted-foreground">Display sidebar navigation by default</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Animations</Label>
              <p className="text-xs text-muted-foreground">Enable smooth animations and transitions</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">High Contrast</Label>
              <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl space-y-6 md:pr-10">
        <CardHeader>
          <CardTitle>Content Preferences</CardTitle>
          <CardDescription>Control how content is organized and displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="items-per-page">Items Per Page</Label>
            <Select defaultValue="20">
              <SelectTrigger id="items-per-page">
                <SelectValue placeholder="Select items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="default-view">Default View</Label>
            <Select defaultValue="grid">
              <SelectTrigger id="default-view">
                <SelectValue placeholder="Select default view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Default</Button>
      </div>
    </div>
  );
}
