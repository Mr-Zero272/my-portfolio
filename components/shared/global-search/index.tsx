'use client';

import { Blog, Contact, Home, Music, Projects, User } from '@/components/icons';
import { AnimatedButton } from '@/components/ui/animated-button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { navbarRoutesInfo } from '@/constants/nav-routes';
import { useGlobalSearch } from '@/store/use-global-search';
import { Code, FileText, GalleryHorizontal, Heart, Info, LayoutGrid, Mail, Search, SquarePen, Tag } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Define the unified routes data structure
interface RouteItem {
  id: string;
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  content?: string;
  category: 'navigation' | 'dashboard' | 'blog' | 'contact' | 'projects' | 'about';
}

// Icon mapping for different routes
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  '/': Home,
  '/about-me': User,
  '/projects': Projects,
  '/contact': Contact,
  '/favorite': Music,
  '/blog': Blog,
  '/piti/dashboard': LayoutGrid,
  '/piti/posts': SquarePen,
  '/piti/tags': Tag,
  '/piti/gallery': GalleryHorizontal,
};

// Main navigation routes from constants
const mainRoutes: RouteItem[] = navbarRoutesInfo.map((route) => ({
  id: route.route.replace('/', '') || 'home',
  title: route.label,
  url: route.route,
  icon: iconMap[route.route] || Home,
  content: getContentForRoute(route.route),
  category: 'navigation' as const,
}));

// Dashboard routes
const dashboardRoutes: RouteItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    url: '/piti/dashboard',
    icon: LayoutGrid,
    content: 'Main dashboard overview - analytics and stats',
    category: 'dashboard',
  },
  {
    id: 'posts',
    title: 'Manage Posts',
    url: '/piti/posts',
    icon: SquarePen,
    content: 'Create, edit and manage blog posts',
    category: 'dashboard',
  },
  {
    id: 'tags',
    title: 'Manage Tags',
    url: '/piti/tags',
    icon: Tag,
    content: 'Organize content with tags and categories',
    category: 'dashboard',
  },
  {
    id: 'gallery',
    title: 'Gallery Management',
    url: '/piti/gallery',
    icon: GalleryHorizontal,
    content: 'Upload and manage images for your content',
    category: 'dashboard',
  },
];

// Additional content routes for better search experience
const contentRoutes: RouteItem[] = [
  {
    id: 'blog-posts',
    title: 'Blog Posts',
    url: '/blog',
    icon: FileText,
    content: 'Read latest articles and tutorials',
    category: 'blog',
  },
  {
    id: 'project-showcase',
    title: 'Project Showcase',
    url: '/projects',
    icon: Code,
    content: 'View my development projects and code samples',
    category: 'projects',
  },
  {
    id: 'about-story',
    title: 'My Story',
    url: '/about-me',
    icon: Info,
    content: 'Learn about my background and experience',
    category: 'about',
  },
  {
    id: 'contact-form',
    title: 'Get in Touch',
    url: '/contact',
    icon: Mail,
    content: 'Send me a message or find my contact information',
    category: 'contact',
  },
  {
    id: 'favorite-music',
    title: 'Music & Interests',
    url: '/favorite',
    icon: Heart,
    content: 'My favorite music and personal interests',
    category: 'about',
  },
];

// Combine all routes
const allRoutes: RouteItem[] = [...mainRoutes, ...dashboardRoutes, ...contentRoutes];

function getContentForRoute(route: string): string {
  const contentMap: Record<string, string> = {
    '/': 'Welcome to my portfolio - home page with overview',
    '/about-me': 'Learn about my background, skills and experience',
    '/projects': 'Explore my development projects and code',
    '/contact': 'Get in touch with me via email or social media',
    '/favorite': 'My favorite music, movies and personal interests',
    '/blog': 'Read my latest blog posts and articles',
  };
  return contentMap[route] || '';
}

interface GlobalSearchProps {
  showSearchButton?: boolean;
  buttonClassName?: string;
  searchPlaceholder?: string;
}

const GlobalSearch = ({
  showSearchButton = true,
  buttonClassName = '',
  searchPlaceholder = 'Search pages, features...',
}: GlobalSearchProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const globalSearch = useGlobalSearch();

  const handleSelect = (route: RouteItem) => {
    router.push(route.url);
    globalSearch.closeSearch();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      globalSearch.openSearch();
    } else {
      globalSearch.closeSearch();
    }
  };

  // Add keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        globalSearch.openSearch();
      }
      // ESC to close
      if (e.key === 'Escape' && globalSearch.open) {
        globalSearch.closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [globalSearch]);

  return (
    <>
      {showSearchButton && (
        <AnimatedButton
          onClick={globalSearch.openSearch}
          title="Search (Ctrl+K)"
          size="icon"
          className={buttonClassName}
        >
          <Search className="h-5 w-5" />
        </AnimatedButton>
      )}

      {/* Command Dialog */}
      <CommandDialog open={globalSearch.open} onOpenChange={handleOpenChange}>
        <CommandInput placeholder={searchPlaceholder} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Main Navigation Group */}
          <CommandGroup heading="Navigation">
            {mainRoutes.map((route) => {
              const IconComponent = route.icon;
              const isCurrentPage = pathname === route.url;
              return (
                <CommandItem
                  key={route.id}
                  value={`${route.title} ${route.content || ''}`}
                  onSelect={() => handleSelect(route)}
                  className={isCurrentPage ? 'bg-blue-50' : ''}
                >
                  <IconComponent className={`mr-2 h-4 w-4 ${isCurrentPage ? 'text-blue-600' : ''}`} />
                  <div className="flex-1">
                    <span className={isCurrentPage ? 'font-medium text-blue-900' : ''}>
                      {route.title}
                      {isCurrentPage && <span className="ml-2 text-xs text-blue-600">(current)</span>}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>

          {/* Dashboard Group */}
          <CommandGroup heading="Dashboard">
            {dashboardRoutes.map((route) => {
              const IconComponent = route.icon;
              const isCurrentPage = pathname === route.url;
              return (
                <CommandItem
                  key={route.id}
                  value={`${route.title} ${route.content || ''}`}
                  onSelect={() => handleSelect(route)}
                  className={isCurrentPage ? 'bg-blue-50' : ''}
                >
                  <IconComponent className={`mr-2 h-4 w-4 ${isCurrentPage ? 'text-blue-600' : ''}`} />
                  <div className="flex-1">
                    <span className={isCurrentPage ? 'font-medium text-blue-900' : ''}>
                      {route.title}
                      {isCurrentPage && <span className="ml-2 text-xs text-blue-600">(current)</span>}
                    </span>
                    {route.content && <div className="text-muted-foreground text-sm">{route.content}</div>}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>

          {/* Content Group */}
          <CommandGroup heading="Content">
            {contentRoutes.map((route) => {
              const IconComponent = route.icon;
              const isCurrentPage = pathname === route.url;
              return (
                <CommandItem
                  key={route.id}
                  value={`${route.title} ${route.content || ''}`}
                  onSelect={() => handleSelect(route)}
                  className={isCurrentPage ? 'bg-blue-50' : ''}
                >
                  <IconComponent className={`mr-2 h-4 w-4 ${isCurrentPage ? 'text-blue-600' : ''}`} />
                  <div className="flex-1">
                    <span className={isCurrentPage ? 'font-medium text-blue-900' : ''}>
                      {route.title}
                      {isCurrentPage && <span className="ml-2 text-xs text-blue-600">(current)</span>}
                    </span>
                    {route.content && <div className="text-muted-foreground text-sm">{route.content}</div>}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;
