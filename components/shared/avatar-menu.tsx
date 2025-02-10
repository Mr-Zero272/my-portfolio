import { Cloud, LifeBuoy, User } from 'lucide-react';
import Link from 'next/link';
import { Github } from '../icons';
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

const AvatarMenu = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="block">
                <button className="size-7">
                    <MyAvatar className="size-6" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
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
                <DropdownMenuItem disabled>
                    <Cloud />
                    <span>Website</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AvatarMenu;
