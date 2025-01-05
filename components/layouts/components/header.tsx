import Home from '@/components/icons/home';
import ThemeButton from '@/components/shared/theme-button';
import ToggleNavButton from '@/components/shared/toggle-nav-button';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
    return (
        <div className="absolute left-1/2 top-0 mt-2 flex -translate-x-1/2 items-center justify-center">
            <ul className="flex w-fit items-center justify-center gap-4 rounded-2xl bg-neutral-100/30 px-3 py-2 backdrop-blur-sm">
                <li className="md:hidden">
                    <ToggleNavButton />
                </li>
                <li className="md:hidden">
                    <Link href="/" className="inline-block rounded-md p-1.5 hover:bg-accent">
                        <Home className="size-5" />
                    </Link>
                </li>
                <li>
                    <ThemeButton />
                </li>
                <li className="min-[1440px]:hidden">
                    <Image
                        className="m-0.5 size-6 cursor-pointer rounded-full border border-transparent hover:border-black"
                        src="/images/profile-img.jpg"
                        width={44}
                        height={44}
                        alt="profile image"
                    />
                </li>
            </ul>
        </div>
    );
};

export default Header;
