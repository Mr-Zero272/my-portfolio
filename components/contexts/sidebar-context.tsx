'use client';
import React, { createContext, useContext, useState } from 'react';

type Props = {
    children: React.ReactNode;
};

type SidebarContextType = {
    isHidden: boolean;
    isOpen: boolean;
    setHiddenState: (isHidden: boolean) => void;
    close: () => void;
    open: () => void;
    toggle: () => void;
    setState: (state: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType>({
    isHidden: false,
    isOpen: false,
    setHiddenState: () => {},
    close: () => {},
    open: () => {},
    toggle: () => {},
    setState: () => {},
});

const SidebarProvider = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHidden, setHiddenState] = useState(false);

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

    return (
        <SidebarContext value={{ isOpen, isHidden, setHiddenState, close, open, setState, toggle }}>
            {children}
        </SidebarContext>
    );
};

export const useSidebar = () => useContext(SidebarContext);

export default SidebarProvider;
