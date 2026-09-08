'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  Laptop,
  LogOut,
  Monitor,
  ShieldCheck,
  ShieldCheckIcon,
  Smartphone,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import ConfirmDialog from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';

import StateUI from '@/components/shared/state-ui';
import StateWrapper from '@/components/shared/state-wrapper';
import { DATE_FORMATS, formatDate, formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useRevokeAllSessions, useRevokeOtherSessions, useRevokeSession } from '../hooks/mutations';
import { useListSessions } from '../hooks/queries';
import ReAuthenticateDialog from './re-authenticate-dialog';

type ConfirmTarget =
  { kind: 'session'; token: string; label: string } | { kind: 'other' } | { kind: 'all' } | null;

type DeviceKind = 'mobile' | 'desktop' | 'unknown';

function describeDevice(userAgent?: string | null): { kind: DeviceKind; label: string } {
  const ua = userAgent ?? '';
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
  const kind: DeviceKind = isMobile ? 'mobile' : ua ? 'desktop' : 'unknown';

  let browser = 'Web';
  if (/Edg(?:e|A)?\//i.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = 'Chrome';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Safari\//i.test(ua)) browser = 'Safari';

  let os = 'Unknown OS';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  const label = browser === 'Web' && os === 'Unknown OS' ? 'Unknown device' : `${browser} · ${os}`;
  return { kind, label };
}

export const SessionsCard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: sessionData } = authClient.useSession();
  const [reAuthDialogOpen, setReAuthDialogOpen] = useState(false);

  const { data: sessions, isLoading, isError, error } = useListSessions();
  const { mutateAsync: revokeOne } = useRevokeSession();
  const { mutateAsync: revokeOthers } = useRevokeOtherSessions();
  const { mutateAsync: revokeAll } = useRevokeAllSessions();

  const [confirm, setConfirm] = useState<ConfirmTarget>(null);

  const currentToken = sessionData?.session?.token;

  const orderedSessions = useMemo(() => {
    if (!sessions) return undefined;
    const copy = [...sessions];
    copy.sort((a, b) => {
      if (a.token === currentToken) return -1;
      if (b.token === currentToken) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return copy;
  }, [sessions, currentToken]);

  const handleConfirm = useCallback(async () => {
    if (!confirm) return;

    if (confirm.kind === 'session') {
      await revokeOne({ token: confirm.token });
      toast.success('Session revoked', {
        description: 'That device has been signed out.',
      });
      return;
    }

    if (confirm.kind === 'other') {
      await revokeOthers();
      toast.success('Signed out of other sessions', {
        description: 'This device stays signed in.',
      });
      return;
    }

    // 'all' — includes the current device.
    await revokeAll();
    toast.success('Signed out everywhere');
    await authClient.signOut().catch(() => undefined);
    queryClient.clear();
    router.replace('/auth/sign-in');
  }, [confirm, queryClient, revokeAll, revokeOne, revokeOthers, router]);

  const confirmContent = confirm
    ? confirm.kind === 'session'
      ? {
          title: 'Revoke this session?',
          description: `You'll be signed out on ${confirm.label}.`,
          confirmLabel: 'Revoke session',
          variant: 'destructive' as const,
        }
      : confirm.kind === 'other'
        ? {
            title: 'Sign out of other sessions?',
            description: 'This will end every active session except this device.',
            confirmLabel: 'Sign out others',
            variant: 'default' as const,
          }
        : {
            title: 'Sign out everywhere?',
            description:
              'This will sign you out on every device, including this one. You will need to sign in again.',
            confirmLabel: 'Sign out everywhere',
            variant: 'destructive' as const,
          }
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Laptop className="size-4" />
          Active sessions
        </CardTitle>
        <CardDescription>
          Devices that are currently signed in to your account. Revoke anything you don&apos;t
          recognize.
        </CardDescription>

        {!isLoading && !isError && sessions && sessions.length > 0 && (
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
                <LogOut className="size-4" />
                Sign out
                <ChevronDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Sign out</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setConfirm({ kind: 'other' })}>
                    <ShieldCheck className="size-4" />
                    Log out other sessions
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setConfirm({ kind: 'all' })}
                  >
                    <LogOut className="size-4" />
                    Log out all sessions
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        <StateWrapper
          data={orderedSessions}
          isLoading={isLoading}
          error={error}
          fallbackLoading={
            <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
              <Spinner />
              Loading sessions…
            </div>
          }
          emptyMessage="No active sessions found."
          fallbackError={
            (error as unknown as { code: string })?.code === 'SESSION_NOT_FRESH' ? (
              <StateUI
                variant="error"
                title="Session Not Fresh"
                description="Your session is not fresh, please log out and log in again"
                actions={
                  <Button size="sm" onClick={() => setReAuthDialogOpen(true)}>
                    <ShieldCheckIcon />
                    Re Authenticate
                  </Button>
                }
              />
            ) : undefined
          }
        >
          {(orderedSessions) => {
            return (
              <ul className="divide-y">
                {orderedSessions.map((session) => {
                  const isCurrent = session.token === currentToken;
                  const device = describeDevice(session.userAgent);
                  const DeviceIcon = device.kind === 'mobile' ? Smartphone : Monitor;

                  return (
                    <li key={session.id} className="flex items-start gap-3 py-3">
                      <span
                        className={cn(
                          'bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg',
                          {
                            'text-primary': isCurrent,
                          },
                        )}
                      >
                        <DeviceIcon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-foreground truncate text-sm font-medium">
                            {device.label}
                          </p>
                          {isCurrent && (
                            <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium">
                              This device
                            </span>
                          )}
                        </div>
                        {session.ipAddress && (
                          <p className="text-muted-foreground truncate text-xs">
                            {session.ipAddress}
                          </p>
                        )}
                        <p className="text-muted-foreground truncate text-xs">
                          Signed in {formatRelativeTime(session.createdAt)} (
                          {formatDate(session.createdAt, DATE_FORMATS.fullDate)}) · Expires{' '}
                          {formatDate(session.expiresAt, DATE_FORMATS.fullDate)}
                        </p>
                      </div>
                      {!isCurrent && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive shrink-0"
                          onClick={() =>
                            setConfirm({
                              kind: 'session',
                              token: session.token,
                              label: device.label,
                            })
                          }
                        >
                          <LogOut className="size-4" />
                          Revoke
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            );
          }}
        </StateWrapper>
      </CardContent>

      {confirm && confirmContent && (
        <ConfirmDialog
          open={confirm !== null}
          onOpenChange={(open) => {
            if (!open) setConfirm(null);
          }}
          variant={confirmContent.variant}
          title={confirmContent.title}
          description={confirmContent.description}
          confirmLabel={confirmContent.confirmLabel}
          onConfirm={handleConfirm}
        />
      )}

      {sessionData && (
        <ReAuthenticateDialog
          open={reAuthDialogOpen}
          onOpenChange={setReAuthDialogOpen}
          email={sessionData.user.email}
        />
      )}
    </Card>
  );
};
