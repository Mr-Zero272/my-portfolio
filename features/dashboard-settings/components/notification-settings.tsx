'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export function NotificationSettings() {
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-none">
        <CardHeader className="border-b">
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Manage your email notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Comments</Label>
              <p className="text-muted-foreground text-xs">Receive email when someone comments on your posts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">New Posts</Label>
              <p className="text-muted-foreground text-xs">Get notified about new posts in your subscribed topics</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Updates</Label>
              <p className="text-muted-foreground text-xs">Receive updates about new features and improvements</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Newsletter</Label>
              <p className="text-muted-foreground text-xs">Weekly newsletter with curated content</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Manage your browser push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Desktop Notifications</Label>
              <p className="text-muted-foreground text-xs">Show desktop notifications for important updates</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Sound</Label>
              <p className="text-muted-foreground text-xs">Play sound when receiving notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Mentions</Label>
              <p className="text-muted-foreground text-xs">Get notified when someone mentions you</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Digest</CardTitle>
          <CardDescription>Control how often you receive activity summaries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Daily Digest</Label>
              <p className="text-muted-foreground text-xs">Receive a summary of daily activities</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Weekly Report</Label>
              <p className="text-muted-foreground text-xs">Get a weekly summary of your dashboard activity</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Monthly Summary</Label>
              <p className="text-muted-foreground text-xs">Monthly analytics and insights report</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}
