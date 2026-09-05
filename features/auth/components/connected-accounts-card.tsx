'use client';

import { AlertCircleIcon, KeyRound, Mail } from 'lucide-react';
import type { ReactNode } from 'react';

import { GoogleIcon } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

import { useListAccounts } from '../hooks/queries';

const PROVIDER_META: Record<string, { label: string; icon: ReactNode; description: string }> = {
  credential: {
    label: 'Email & password',
    icon: <Mail className="size-4" />,
    description: 'Your email and password sign-in method',
  },
  google: {
    label: 'Google',
    icon: <GoogleIcon className="size-4" />,
    description: 'Sign in with your Google account',
  },
};

function metaFor(providerId: string) {
  return (
    PROVIDER_META[providerId] ?? {
      label: providerId,
      icon: <KeyRound className="size-4" />,
      description: 'Connected authentication method',
    }
  );
}

function formatDate(value?: Date): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const ConnectedAccountsCard = () => {
  const { data: accounts, isLoading, isError, error, refetch } = useListAccounts();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="size-4" />
          Connected accounts
        </CardTitle>
        <CardDescription>
          Authentication methods linked to your account. Better Auth links matching providers
          automatically on sign-in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Spinner />
            Loading accounts…
          </div>
        )}

        {isError && (
          <Alert variant="error">
            <AlertCircleIcon className="size-4" />
            <AlertTitle>Failed to load accounts</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Something went wrong.'}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && accounts && accounts.length === 0 && (
          <p className="py-4 text-sm text-muted-foreground">
            No connected accounts yet.
          </p>
        )}

        {!isLoading &&
          !isError &&
          accounts &&
          accounts.length > 0 && (
            <ul className="divide-y">
              {accounts.map((account) => {
                const meta = metaFor(account.providerId);
                return (
                  <li key={account.id} className="flex items-center gap-3 py-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{meta.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{meta.description}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {account.issuer && <p className="font-mono">{account.issuer}</p>}
                      {formatDate(account.createdAt) && (
                        <p>Connected {formatDate(account.createdAt)}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

        {!isLoading && !isError && (
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Refresh
          </button>
        )}
      </CardContent>
    </Card>
  );
};
