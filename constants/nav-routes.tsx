import { Contact, ContactSolid, Home, HomeSolid, Projects, ProjectsSolid, User, UserSolid } from '@/components/icons';

export const navbarRoutesInfo = [
    {
        icon: Home,
        iconSolid: HomeSolid,
        route: '/',
        label: 'Home',
    },
    {
        icon: User,
        iconSolid: UserSolid,
        route: '/about-me',
        label: 'About me',
    },
    {
        icon: Projects,
        iconSolid: ProjectsSolid,
        route: '/projects',
        label: 'Projects',
    },
    {
        icon: Contact,
        iconSolid: ContactSolid,
        route: '/contact',
        label: 'Contact',
    },
];
