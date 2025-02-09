import Home from '@/components/icons/home';
import AvatarMenu from '@/components/shared/avatar-menu';
import ThemeButton from '@/components/shared/theme-button';
import ToggleNavButton from '@/components/shared/toggle-nav-button';
import Link from 'next/link';

const Header = () => {
    return (
        <div className="absolute left-1/2 top-0 mt-2 flex -translate-x-1/2 items-center justify-center">
            <ul className="flex w-fit items-center justify-center gap-4 rounded-2xl bg-neutral-100/30 px-3 py-2 backdrop-blur-sm">
                <li className="md:hidden">
                    <ToggleNavButton />
                </li>
                <li className="md:hidden">
                    <Link href="/" className="block rounded-md p-1.5 hover:bg-accent">
                        <Home className="size-5" />
                    </Link>
                </li>
                <li>
                    <ThemeButton />
                </li>
                <li className="min-[1440px]:hidden">
                    <AvatarMenu />
                </li>
            </ul>
        </div>
    );
};

export default Header;
