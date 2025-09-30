'use client';

import AvatarMenu from '@/components/shared/avatar-menu';
import SearchGeneric from '@/components/shared/search-generic';
import useSearchGeneric from '@/components/shared/search-generic/use-search-generic';
import ThemeButton from '@/components/shared/theme-button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GalleryHorizontal, LayoutGrid, Search, SquarePen, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Define the routes data structure
interface RouteItem {
  id: string;
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  content?: string;
}

const dashboardRoutes: RouteItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    url: '/piti/dashboard',
    icon: LayoutGrid,
    content: 'Main dashboard overview',
  },
  {
    id: 'posts',
    title: 'Posts',
    url: '/piti/posts',
    icon: SquarePen,
    content: 'Manage blog posts',
  },
  {
    id: 'tags',
    title: 'Tags',
    url: '/piti/tags',
    icon: Tag,
    content: 'Manage content tags',
  },
  {
    id: 'gallery',
    title: 'Gallery',
    url: '/piti/gallery',
    icon: GalleryHorizontal,
    content: 'Image gallery management',
  },
];

const DashboardHeader = () => {
  const router = useRouter();
  const searchProps = useSearchGeneric<RouteItem>({
    onSelect: (route) => {
      router.push(route.url);
    },
  });

  const renderRouteItem = (route: RouteItem) => {
    const IconComponent = route.icon;
    return (
      <div className="flex items-center gap-3">
        <IconComponent className="h-4 w-4 text-gray-500" />
        <div className="flex-1">
          <div className="font-medium text-gray-900">{route.title}</div>
          {route.content && <div className="text-sm text-gray-500">{route.content}</div>}
        </div>
      </div>
    );
  };

  // Add keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchProps.openSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchProps]);
  return (
    <>
      <div className="bg-background fixed top-2 mt-1 flex h-16 w-[calc(100%-18rem)] flex-1 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            Welcome back, <span className="text-primary">Piti</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <AnimatedButton onClick={searchProps.openSearch} title="Search routes (Ctrl+K)">
            <Search className="h-5 w-5" />
          </AnimatedButton>
          <ThemeButton className="block" />
          <AvatarMenu />
        </div>
      </div>
      <div className="h-20" />

      {/* Search Component */}
      <SearchGeneric
        isOpen={searchProps.isOpen}
        onOpenChange={searchProps.onOpenChange}
        value={searchProps.value}
        onValueChange={searchProps.onValueChange}
        data={dashboardRoutes}
        onSelect={searchProps.onSelect}
        renderResultItem={renderRouteItem}
        placeholder="Search dashboard routes..."
        emptyStateMessage="Start typing to search routes"
        noResultsMessage="No routes found for"
        searchKeys={['title', 'content']}
        maxResults={10}
      />
    </>
  );
};

export default DashboardHeader;
