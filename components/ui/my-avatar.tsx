'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
    className?: string;
    onClick?: () => void;
};

const MyAvatar = ({ onClick = () => {}, className = '' }: Props) => {
    const [active, setActive] = useState(false);
    const avatarRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
                setActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [avatarRef]);

    const handleAvatarClick = () => {
        setActive((prev) => !prev);
        onClick();
    };
    return (
        <Image
            ref={avatarRef}
            className={cn(
                'size-10 cursor-pointer rounded-full p-0.5 ring-2 ring-transparent hover:ring-muted-foreground',
                {
                    [className]: className,
                    'ring-muted-foreground': active,
                },
            )}
            src="/images/profile-img.png"
            width={44}
            height={44}
            alt="profile image"
            onClick={handleAvatarClick}
        />
    );
};

export default MyAvatar;
