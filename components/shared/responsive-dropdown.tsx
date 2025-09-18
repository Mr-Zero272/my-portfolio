"use client";

import * as React from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ResponsiveDropdownProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  trigger?: React.ReactNode;
}

interface ResponsiveDropdownContentProps {
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDropdownTriggerProps {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

interface ResponsiveDropdownHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDropdownFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDropdownTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDropdownDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

interface ResponsiveDropdownCloseProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

// Context to track if we're using mobile/desktop
const ResponsiveDropdownContext = React.createContext<{
  isMobile: boolean;
}>({
  isMobile: false,
});

function ResponsiveDropdown({ open, onOpenChange, children, trigger }: ResponsiveDropdownProps) {
  const isMobile = useIsMobile();

  const contextValue = React.useMemo(
    () => ({
      isMobile: isMobile ?? false,
    }),
    [isMobile],
  );

  if (isMobile) {
    return (
      <ResponsiveDropdownContext.Provider value={contextValue}>
        <Drawer open={open} onOpenChange={onOpenChange}>
          {trigger}
          {children}
        </Drawer>
      </ResponsiveDropdownContext.Provider>
    );
  }

  return (
    <ResponsiveDropdownContext.Provider value={contextValue}>
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
        {trigger}
        {children}
      </DropdownMenu>
    </ResponsiveDropdownContext.Provider>
  );
}

function ResponsiveDropdownTrigger({ className, children, asChild, ...props }: ResponsiveDropdownTriggerProps) {
  const { isMobile } = React.useContext(ResponsiveDropdownContext);

  if (isMobile) {
    return (
      <DrawerTrigger className={className} asChild={asChild} {...props}>
        {children}
      </DrawerTrigger>
    );
  }

  return (
    <DropdownMenuTrigger className={className} asChild={asChild} {...props}>
      {children}
    </DropdownMenuTrigger>
  );
}

function ResponsiveDropdownContent({ className, children, ...props }: ResponsiveDropdownContentProps) {
  const { isMobile } = React.useContext(ResponsiveDropdownContext);

  if (isMobile) {
    return (
      <DrawerContent className={className} {...props}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DropdownMenuContent className={className} {...props}>
      {children}
    </DropdownMenuContent>
  );
}

function ResponsiveDropdownHeader({ className, children, ...props }: ResponsiveDropdownHeaderProps) {
  const { isMobile } = React.useContext(ResponsiveDropdownContext);

  if (isMobile) {
    return (
      <DrawerHeader className={className} {...props}>
        {children}
      </DrawerHeader>
    );
  }

  return (
    <DropdownMenuLabel className={className} {...props}>
      {children}
    </DropdownMenuLabel>
  );
}

function ResponsiveDropdownFooter({ className, children, ...props }: ResponsiveDropdownFooterProps) {
  const { isMobile } = React.useContext(ResponsiveDropdownContext);

  if (isMobile) {
    return (
      <DrawerFooter className={className} {...props}>
        {children}
      </DrawerFooter>
    );
  }

  // DropdownMenu doesn't have a footer, so just render children
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

function ResponsiveDropdownTitle({ className, children, ...props }: ResponsiveDropdownTitleProps) {
  const { isMobile } = React.useContext(ResponsiveDropdownContext);

  if (isMobile) {
    return (
      <DrawerTitle className={className} {...props}>
        {children}
      </DrawerTitle>
    );
  }

  // DropdownMenu doesn't have a title, so just render children
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

function ResponsiveDropdownDescription({ className, children, ...props }: ResponsiveDropdownDescriptionProps) {
  const { isMobile } = React.useContext(ResponsiveDropdownContext);

  if (isMobile) {
    return (
      <DrawerDescription className={className} {...props}>
        {children}
      </DrawerDescription>
    );
  }

  // DropdownMenu doesn't have a description, so just render children
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

function ResponsiveDropdownClose({ className, children, asChild, ...props }: ResponsiveDropdownCloseProps) {
  const { isMobile } = React.useContext(ResponsiveDropdownContext);

  if (isMobile) {
    return (
      <DrawerClose className={className} asChild={asChild} {...props}>
        {children}
      </DrawerClose>
    );
  }

  // DropdownMenu doesn't have a close, so just render children
  return <>{children}</>;
}

export {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  // Optionally re-export DropdownMenu primitives for advanced use
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  ResponsiveDropdown,
  ResponsiveDropdownClose,
  ResponsiveDropdownContent,
  ResponsiveDropdownDescription,
  ResponsiveDropdownFooter,
  ResponsiveDropdownHeader,
  ResponsiveDropdownTitle,
  ResponsiveDropdownTrigger,
};
