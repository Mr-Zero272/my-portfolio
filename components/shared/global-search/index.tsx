'use client';

import { Blog, Contact, Home, Music, Projects, User } from '@/components/icons';
import SearchGeneric from '@/components/shared/search-generic';
import useSearchGeneric from '@/components/shared/search-generic/use-search-generic';
import { AnimatedButton } from '@/components/ui/animated-button';
import { navbarRoutesInfo } from '@/constants/nav-routes';
import { useGlobalSearch } from '@/store/use-global-search';
import { Code, FileText, GalleryHorizontal, Heart, Info, LayoutGrid, Mail, Search, SquarePen, Tag } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

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

  const searchProps = useSearchGeneric<RouteItem>({
    onSelect: (route) => {
      router.push(route.url);
      globalSearch.closeSearch();
    },
  });

  // Handle search state changes to sync back to global store
  const handleOpenChange = useCallback(
    (open: boolean) => {
      searchProps.onOpenChange(open);
      if (open) {
        globalSearch.openSearch();
      } else {
        globalSearch.closeSearch();
      }
    },
    [searchProps, globalSearch],
  );

  // Sync global search state with local search state
  useEffect(() => {
    if (globalSearch.open && !searchProps.isOpen) {
      searchProps.openSearch();
    } else if (!globalSearch.open && searchProps.isOpen) {
      searchProps.closeSearch();
    }
  }, [globalSearch.open]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderRouteItem = (route: RouteItem) => {
    const IconComponent = route.icon;
    const isCurrentPage = pathname === route.url;

    return (
      <div className={`flex items-center gap-3 ${isCurrentPage ? '-m-2 rounded-lg bg-blue-50 p-2' : ''}`}>
        <IconComponent className={`h-4 w-4 ${isCurrentPage ? 'text-blue-600' : 'text-gray-500'}`} />
        <div className="flex-1">
          <div className={`font-medium ${isCurrentPage ? 'text-blue-900' : 'text-gray-900'}`}>
            {route.title}
            {isCurrentPage && <span className="ml-2 text-xs text-blue-600">(current)</span>}
          </div>
          {route.content && (
            <div className={`text-sm ${isCurrentPage ? 'text-blue-700' : 'text-gray-500'}`}>{route.content}</div>
          )}
          <div className="mt-1 text-xs text-gray-400 capitalize">
            {route.category} • {route.url}
          </div>
        </div>
      </div>
    );
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
          variant="ghost"
          size="icon"
          className={buttonClassName}
        >
          <Search className="h-5 w-5" />
        </AnimatedButton>
      )}

      {/* Search Component */}
      <SearchGeneric
        isOpen={searchProps.isOpen}
        onOpenChange={handleOpenChange}
        value={searchProps.value}
        onValueChange={searchProps.onValueChange}
        data={allRoutes}
        onSelect={searchProps.onSelect}
        renderResultItem={renderRouteItem}
        placeholder={searchPlaceholder}
        emptyStateMessage="Start typing to search pages and features"
        noResultsMessage="No pages or features found for"
        searchKeys={['title', 'content', 'category']}
        maxResults={12}
        className="z-50"
      />
    </>
  );
};

export default GlobalSearch;
