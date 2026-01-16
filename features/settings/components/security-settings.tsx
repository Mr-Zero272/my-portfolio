'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export function SecuritySettings() {
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-none">
        <CardHeader className="border-b">
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Update Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">SMS Authentication</p>
              <p className="text-muted-foreground text-xs">Receive verification codes via SMS</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Authenticator App</p>
              <p className="text-muted-foreground text-xs">Use an authenticator app to generate codes</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Email Authentication</p>
              <p className="text-muted-foreground text-xs">Receive verification codes via email</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active login sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Session Item */}
            <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Windows • Chrome</p>
                <p className="text-muted-foreground text-xs">Ho Chi Minh City, Vietnam</p>
                <p className="text-muted-foreground text-xs">Last active: 5 minutes ago</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Revoke
              </Button>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">MacOS • Safari</p>
                <p className="text-muted-foreground text-xs">Hanoi, Vietnam</p>
                <p className="text-muted-foreground text-xs">Last active: 2 hours ago</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Revoke
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="destructive" size="sm">
              Revoke All Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
