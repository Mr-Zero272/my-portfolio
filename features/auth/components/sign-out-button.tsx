'use client';

import ConfirmDialog from '@/components/shared/confirm-dialog';
import { LogOutIcon } from 'lucide-react';
import * as React from 'react';
import { useSignout } from '../hooks';
import { mergeProps, useRender } from '@base-ui/react';

type LogoutButtonProps = useRender.ComponentProps<'button'>;

export function LogoutButton({ render, ...props }: LogoutButtonProps) {
  const [open, setOpen] = React.useState(false);
  const { handleSignOut } = useSignout();

  const element = useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(
      {
        onClick: () => setOpen(true),
        children: (
          <>
            <LogOutIcon />
            Logout
          </>
        ),
      },
      props,
    ),
  });

  return (
    <>
      {element}

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
