'use client';

import { usePathname } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

function AppBreadcrumbs() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter((segment) => segment.length > 0);
    return [
      { label: 'Dashboard', href: '/dashboard' },
      ...segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        return { label, href };
      }),
    ];
  }, [pathname]);

  // Logic to determine which breadcrumbs to show
  // Only apply ellipsis on small screens (< 1024px)
  const shouldShowEllipsis = !isLargeScreen && breadcrumbs && breadcrumbs.length > 3;
  const middleBreadcrumbs = !isLargeScreen && breadcrumbs && breadcrumbs.length > 3 ? breadcrumbs.slice(1, -1) : [];
  const displayBreadcrumbs =
    !isLargeScreen && breadcrumbs && breadcrumbs.length > 3
      ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]]
      : breadcrumbs || [];

  return (
    <div>
      {/* Breadcrumb */}
      {breadcrumbs && (
        <Breadcrumb>
          <BreadcrumbList>
            {displayBreadcrumbs.map((crumb, idx) => (
              <Fragment key={idx}>
                {idx > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href} className="max-w-60 truncate">
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="max-w-60 truncate">{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {/* Show ellipsis with dropdown after first item */}
                {idx === 0 && shouldShowEllipsis && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                          <BreadcrumbEllipsis className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {middleBreadcrumbs.map((crumb, midIdx) => (
                            <DropdownMenuItem key={midIdx} asChild>
                              {crumb.href ? (
                                <BreadcrumbLink href={crumb.href} className="cursor-pointer">
                                  {crumb.label}
                                </BreadcrumbLink>
                              ) : (
                                <span>{crumb.label}</span>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                  </>
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </div>
  );
}

export default AppBreadcrumbs;
