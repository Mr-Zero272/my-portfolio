'use client';
import React, { createContext, useContext, useState } from 'react';

type Props = {
    children: React.ReactNode;
};

type SidebarContextType = {
    isOpen: boolean;
    close: () => void;
    open: () => void;
    toggle: () => void;
    setState: (state: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType>({
    isOpen: false,
    close: () => {},
    open: () => {},
    toggle: () => {},
    setState: () => {},
});

const SidebarProvider = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const close = () => {
        setIsOpen(false);
    };
    const open = () => {
        setIsOpen(true);
    };

    const setState = (state: boolean) => {
        setIsOpen(state);
    };

    const toggle = () => {
        setIsOpen((prev) => !prev);
    };

    return <SidebarContext value={{ isOpen, close, open, setState, toggle }}>{children}</SidebarContext>;
};

export const useSidebar = () => useContext(SidebarContext);

export default SidebarProvider;
