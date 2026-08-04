import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unauthorized',
  description: 'You do not have permission to access this page.',
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Unauthorized</h1>
      <p className="text-muted-foreground text-center text-sm">
        You do not have permission to access this area.
      </p>
      <Link
        href="/auth/sign-in"
        className="text-primary text-sm font-medium underline-offset-4 hover:underline"
      >
        Sign in
      </Link>
    </div>
  );
}
