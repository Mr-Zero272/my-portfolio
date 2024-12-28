import { FolderCode, LayoutGrid, Mails, UserRound } from "lucide-react";

export const navbarRoutesInfo = [
  {
    icon: LayoutGrid,
    route: "/",
    label: "Home",
  },
  {
    icon: UserRound,
    route: "/resume",
    label: "Resume",
  },
  {
    icon: FolderCode,
    solidIcon: "/images/projects-icon-solid.svg",
    route: "/projects",
    label: "Projects",
  },
  {
    icon: Mails,
    solidIcon: "/images/contact-icon-solid.svg",
    route: "/contact",
    label: "Contact",
  },
];
