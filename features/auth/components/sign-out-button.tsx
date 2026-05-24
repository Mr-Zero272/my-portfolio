'use client';

import ConfirmDialog from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';
import * as React from 'react';
import { useSignout } from '../hooks';

type LogoutButtonProps = {
  render?: (props: { onClick: () => void }) => React.ReactNode;
  onClick?: () => void;
} & React.ComponentProps<'button'>;

export function LogoutButton({ render, ...props }: LogoutButtonProps) {
  const [open, setOpen] = React.useState(false);
  const { handleSignOut } = useSignout();

  return (
    <>
      {render ? (
        render({ onClick: () => setOpen(true) })
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)} {...props}>
          <LogOutIcon />
          Logout
        </Button>
      )}

      <ConfirmDialog
        icon={<LogOutIcon />}
        open={open}
        onOpenChange={setOpen}
        title="Logout"
        description="Are you sure you want to logout?"
        onConfirm={handleSignOut}
        cancelLabel="Cancel"
        confirmLabel="Logout"
      />
    </>
  );
}
