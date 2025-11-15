'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const themes = [
  { name: 'Light', icon: Sun, value: 'light', description: 'Light theme' },
  { name: 'Dark', icon: Moon, value: 'dark', description: 'Dark theme' },
  { name: 'System', icon: Monitor, value: 'system', description: 'Follow system' },
];

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-4">
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
                    'hover:bg-accent flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-4 transition-colors',
                    theme === value ? 'border-primary' : 'border-transparent',
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-muted-foreground text-xs">{description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <Select defaultValue="blue">
              <SelectTrigger id="accent-color">
                <SelectValue placeholder="Select accent color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Compact Mode</Label>
              <p className="text-muted-foreground text-xs">Reduce spacing for a more compact layout</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
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
              <p className="text-muted-foreground text-xs">Display sidebar navigation by default</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Animations</Label>
              <p className="text-muted-foreground text-xs">Enable smooth animations and transitions</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">High Contrast</Label>
              <p className="text-muted-foreground text-xs">Increase contrast for better visibility</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
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
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
