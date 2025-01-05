'use client';
import React, { useEffect, useState } from 'react';
import Sun from '../icons/sun';
import Moon from '../icons/moon';
import { useTheme } from 'next-themes';

type Props = {
    className?: string;
};

const ThemeButton = ({ className = '' }: Props) => {
    const { theme, setTheme } = useTheme();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    const handleToggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    if (!hydrated) {
        return null;
    }

    return (
        <button className={`rounded-md p-1.5 hover:bg-accent ${className}`} onClick={handleToggleTheme}>
            {theme && theme === 'light' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
    );
};

export default ThemeButton;
