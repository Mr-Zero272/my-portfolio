'use client';
import { AlignLeft } from 'lucide-react';
import React from 'react';
import { useSidebar } from '../contexts/sidebar-context';

type Props = {
    className?: string;
};

const ToggleNavButton = ({ className = '' }: Props) => {
    const { toggle } = useSidebar();
    return (
        <button className={`cursor-pointer rounded-md p-1.5 hover:bg-accent ${className}`} onClick={toggle}>
            <AlignLeft className="size-5" />
        </button>
    );
};

export default ToggleNavButton;
