'use client';

import { Cloud, LifeBuoy, LogOut, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Github } from '../icons';
import { AnimatedButton } from '../ui/animated-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import MyAvatar from '../ui/my-avatar';
import LogoutDialog from './logout-dialog';

interface AvatarMenuProps {
  trigger?: React.ReactNode;
}

const AvatarMenu = ({ trigger }: AvatarMenuProps) => {
  const { status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild className="block">
          {trigger ? (
            trigger
          ) : (
            <AnimatedButton variant="none" size={'icon'} className="size-7 focus:ring-0 focus-visible:ring-0">
              <MyAvatar className="size-6" />
            </AnimatedButton>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
          <DropdownMenuLabel>@pitithuong</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/about-me">
              <DropdownMenuItem>
                <User />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link href="https://github.com/Mr-Zero272">
            <DropdownMenuItem>
              <Github />
              <span>GitHub</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/contact">
            <DropdownMenuItem>
              <LifeBuoy />
              <span>Support</span>
            </DropdownMenuItem>
          </Link>
          <Link href="https://pitithuong.vercel.app/" target="_blank" rel="noreferrer">
            <DropdownMenuItem>
              <Cloud />
              <span>Website</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          {status === 'authenticated' && (
            <DropdownMenuItem
              onClick={() => {
                setIsDropdownOpen(false);
                setTimeout(() => setIsDialogOpen(true), 100);
              }}
            >
              <LogOut />
              <span>Sign out</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
};

export default AvatarMenu;
