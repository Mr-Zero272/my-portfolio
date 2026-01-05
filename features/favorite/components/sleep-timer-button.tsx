'use client';

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/shared/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMusicStore } from '@/store/use-music-store';
import { useState } from 'react';
import { toast } from 'sonner';

const TIMER_OPTIONS = [5, 10, 15, 30, 45, 60];

interface SleepTimerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SleepTimerDialog = ({ open, onOpenChange }: SleepTimerDialogProps) => {
  const setSleepTimer = useMusicStore((state) => state.setSleepTimer);
  const sleepTimerTarget = useMusicStore((state) => state.sleepTimerTarget);
  const cancelSleepTimer = useMusicStore((state) => state.cancelSleepTimer);

  const [customMinutes, setCustomMinutes] = useState('');

  const handleSetTimer = (minutes: number) => {
    setSleepTimer(minutes);
    onOpenChange(false);
    toast.success(`Sleep timer set for ${minutes} minutes`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      toast.error('Please enter a valid number of minutes');
      return;
    }
    handleSetTimer(minutes);
    setCustomMinutes('');
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Sleep Timer</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            {TIMER_OPTIONS.map((minutes) => (
              <Button key={minutes} variant="outline" onClick={() => handleSetTimer(minutes)}>
                {minutes} min
              </Button>
            ))}
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label>Custom Duration (minutes)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Enter minutes..."
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                />
                <Button type="submit">Set</Button>
              </div>
            </div>
          </form>

          {sleepTimerTarget && (
            <Button
              variant="destructive"
              className="mt-2 w-full"
              onClick={() => {
                cancelSleepTimer();
                onOpenChange(false);
                toast.info('Sleep timer cancelled');
              }}
            >
              Stop Timer
            </Button>
          )}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
