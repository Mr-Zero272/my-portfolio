'use client';

import * as React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { mergeProps, useRender } from '@base-ui/react';

// ─── Context ─────────────────────────────────────────────────────────────────

type ResponsiveDialogContextProps = {
  isMobile: boolean;
};

const ResponsiveDialogContext = React.createContext<ResponsiveDialogContextProps | null>(null);

function useResponsiveDialog() {
  const context = React.useContext(ResponsiveDialogContext);
  if (!context) {
    throw new Error('useResponsiveDialog must be used within a ResponsiveDialog');
  }
  return context;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type ResponsiveDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  dialogProps?: Omit<React.ComponentProps<typeof Dialog>, 'open' | 'onOpenChange' | 'children'>;
  drawerProps?: Omit<
    React.ComponentProps<typeof Drawer>,
    'open' | 'onOpenChange' | 'children' | 'fadeFromIndex'
  >;
};

function ResponsiveDialog({
  open,
  onOpenChange,
  children,
  dialogProps,
  drawerProps,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange} {...drawerProps}>
          {children}
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange} {...dialogProps}>
          {children}
        </Dialog>
      )}
    </ResponsiveDialogContext.Provider>
  );
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

type ResponsiveDialogTriggerProps = {
  children?: React.ReactNode;
  className?: string;
  // eslint-disable-next-line
  render?: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
  dialogProps?: Omit<React.ComponentProps<typeof DialogTrigger>, 'className' | 'render'>;
  drawerProps?: Omit<React.ComponentProps<typeof DrawerTrigger>, 'className' | 'asChild'>;
};

function ResponsiveDialogTrigger({
  children,
  className,
  render,
  dialogProps,
  drawerProps,
}: ResponsiveDialogTriggerProps) {
  const { isMobile } = useResponsiveDialog();

  const mergedElement = useRender({
    defaultTagName: 'button', // or whatever default you want
    render,
    props: mergeProps({ className }, children ? { children } : {}),
    // Note: children passed directly to useRender might need different handling
  });

  if (isMobile) {
    return (
      <DrawerTrigger className={className} asChild {...drawerProps}>
        {render ? mergedElement : children}
      </DrawerTrigger>
    );
  }

  return (
    <DialogTrigger className={className} render={render} {...dialogProps}>
      {children}
    </DialogTrigger>
  );
}

// ─── Close ────────────────────────────────────────────────────────────────────

type ResponsiveDialogCloseProps = {
  children?: React.ReactNode;
  className?: string;
  dialogProps?: Omit<React.ComponentProps<typeof DialogClose>, 'children' | 'className'>;
  drawerProps?: Omit<React.ComponentProps<typeof DrawerClose>, 'children' | 'className'>;
};

function ResponsiveDialogClose({
  children,
  className,
  dialogProps,
  drawerProps,
}: ResponsiveDialogCloseProps) {
  const { isMobile } = useResponsiveDialog();
  if (isMobile) {
    return (
      <DrawerClose className={className} {...drawerProps}>
        {children}
      </DrawerClose>
    );
  }
  return (
    <DialogClose className={className} {...dialogProps}>
      {children}
    </DialogClose>
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────

type ResponsiveDialogContentProps = {
  children?: React.ReactNode;
  className?: string;
  dialogProps?: Omit<React.ComponentProps<typeof DialogContent>, 'children' | 'className'>;
  drawerProps?: Omit<React.ComponentProps<typeof DrawerContent>, 'children' | 'className'>;
};

function ResponsiveDialogContent({
  children,
  className,
  dialogProps,
  drawerProps,
}: ResponsiveDialogContentProps) {
  const { isMobile } = useResponsiveDialog();
  if (isMobile) {
    return (
      <DrawerContent className={className} {...drawerProps}>
        {children}
      </DrawerContent>
    );
  }
  return (
    <DialogContent className={className} {...dialogProps}>
      {children}
    </DialogContent>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

type ResponsiveDialogHeaderProps = {
  children?: React.ReactNode;
  className?: string;
  dialogProps?: Omit<React.ComponentProps<typeof DialogHeader>, 'children' | 'className'>;
  drawerProps?: Omit<React.ComponentProps<typeof DrawerHeader>, 'children' | 'className'>;
};

function ResponsiveDialogHeader({
  children,
  className,
  dialogProps,
  drawerProps,
}: ResponsiveDialogHeaderProps) {
  const { isMobile } = useResponsiveDialog();
  if (isMobile) {
    return (
      <DrawerHeader className={className} {...drawerProps}>
        {children}
      </DrawerHeader>
    );
  }
  return (
    <DialogHeader className={className} {...dialogProps}>
      {children}
    </DialogHeader>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

type ResponsiveDialogFooterProps = {
  children?: React.ReactNode;
  className?: string;
  dialogProps?: Omit<React.ComponentProps<typeof DialogFooter>, 'children' | 'className'>;
  drawerProps?: Omit<React.ComponentProps<typeof DrawerFooter>, 'children' | 'className'>;
};

function ResponsiveDialogFooter({
  children,
  className,
  dialogProps,
  drawerProps,
}: ResponsiveDialogFooterProps) {
  const { isMobile } = useResponsiveDialog();
  if (isMobile) {
    return (
      <DrawerFooter className={className} {...drawerProps}>
        {children}
      </DrawerFooter>
    );
  }
  return (
    <DialogFooter className={className} {...dialogProps}>
      {children}
    </DialogFooter>
  );
}

// ─── Title ────────────────────────────────────────────────────────────────────

type ResponsiveDialogTitleProps = {
  children?: React.ReactNode;
  className?: string;
  dialogProps?: Omit<React.ComponentProps<typeof DialogTitle>, 'children' | 'className'>;
  drawerProps?: Omit<React.ComponentProps<typeof DrawerTitle>, 'children' | 'className'>;
};

function ResponsiveDialogTitle({
  children,
  className,
  dialogProps,
  drawerProps,
}: ResponsiveDialogTitleProps) {
  const { isMobile } = useResponsiveDialog();
  if (isMobile) {
    return (
      <DrawerTitle className={className} {...drawerProps}>
        {children}
      </DrawerTitle>
    );
  }
  return (
    <DialogTitle className={className} {...dialogProps}>
      {children}
    </DialogTitle>
  );
}

// ─── Description ─────────────────────────────────────────────────────────────

type ResponsiveDialogDescriptionProps = {
  children?: React.ReactNode;
  className?: string;
  dialogProps?: Omit<React.ComponentProps<typeof DialogDescription>, 'children' | 'className'>;
  drawerProps?: Omit<React.ComponentProps<typeof DrawerDescription>, 'children' | 'className'>;
};

function ResponsiveDialogDescription({
  children,
  className,
  dialogProps,
  drawerProps,
}: ResponsiveDialogDescriptionProps) {
  const { isMobile } = useResponsiveDialog();
  if (isMobile) {
    return (
      <DrawerDescription className={className} {...drawerProps}>
        {children}
      </DrawerDescription>
    );
  }
  return (
    <DialogDescription className={className} {...dialogProps}>
      {children}
    </DialogDescription>
  );
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};
