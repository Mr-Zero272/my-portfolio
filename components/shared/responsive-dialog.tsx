'use client';

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
import * as React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface ResponsiveDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  trigger?: React.ReactNode;
}

interface ResponsiveDialogContentProps {
  className?: string;
  children: React.ReactNode;
  isShowCloseButton?: boolean;
}

interface ResponsiveDialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDialogTriggerProps {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

interface ResponsiveDialogCloseProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

// Context to track if we're using mobile/desktop
const ResponsiveDialogContext = React.createContext<{
  isMobile: boolean;
}>({
  isMobile: false,
});

function ResponsiveDialog({ open, onOpenChange, children, trigger }: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  const contextValue = React.useMemo(
    () => ({
      isMobile: isMobile ?? false,
    }),
    [isMobile],
  );

  if (isMobile) {
    return (
      <ResponsiveDialogContext.Provider value={contextValue}>
        <Drawer open={open} onOpenChange={onOpenChange}>
          {trigger}
          {children}
        </Drawer>
      </ResponsiveDialogContext.Provider>
    );
  }

  return (
    <ResponsiveDialogContext.Provider value={contextValue}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger}
        {children}
      </Dialog>
    </ResponsiveDialogContext.Provider>
  );
}

function ResponsiveDialogTrigger({ className, children, asChild, ...props }: ResponsiveDialogTriggerProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <DrawerTrigger className={className} asChild={asChild} {...props}>
        {children}
      </DrawerTrigger>
    );
  }

  return (
    <DialogTrigger className={className} asChild={asChild} {...props}>
      {children}
    </DialogTrigger>
  );
}

function ResponsiveDialogContent({
  className,
  children,
  isShowCloseButton = true,
  ...props
}: ResponsiveDialogContentProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <DrawerContent className={className} {...props}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent className={className} {...props} showCloseButton={isShowCloseButton}>
      {children}
    </DialogContent>
  );
}

function ResponsiveDialogHeader({ className, children, ...props }: ResponsiveDialogHeaderProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <DrawerHeader className={className} {...props}>
        {children}
      </DrawerHeader>
    );
  }

  return (
    <DialogHeader className={className} {...props}>
      {children}
    </DialogHeader>
  );
}

function ResponsiveDialogFooter({ className, children, ...props }: ResponsiveDialogFooterProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <DrawerFooter className={className} {...props}>
        {children}
      </DrawerFooter>
    );
  }

  return (
    <DialogFooter className={className} {...props}>
      {children}
    </DialogFooter>
  );
}

function ResponsiveDialogTitle({ className, children, ...props }: ResponsiveDialogTitleProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <DrawerTitle className={className} {...props}>
        {children}
      </DrawerTitle>
    );
  }

  return (
    <DialogTitle className={className} {...props}>
      {children}
    </DialogTitle>
  );
}

function ResponsiveDialogDescription({ className, children, ...props }: ResponsiveDialogDescriptionProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <DrawerDescription className={className} {...props}>
        {children}
      </DrawerDescription>
    );
  }

  return (
    <DialogDescription className={className} {...props}>
      {children}
    </DialogDescription>
  );
}

function ResponsiveDialogClose({ className, children, asChild, ...props }: ResponsiveDialogCloseProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <DrawerClose className={className} asChild={asChild} {...props}>
        {children}
      </DrawerClose>
    );
  }

  return (
    <DialogClose className={className} asChild={asChild} {...props}>
      {children}
    </DialogClose>
  );
}

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
