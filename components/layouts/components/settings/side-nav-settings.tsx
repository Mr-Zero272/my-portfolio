'use client';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { useMobileMenuStore } from '@/store/use-mobile-menu-store';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { sideNavSettingsItems } from './data';

interface SideNavSettingsProps {
  className?: string;
}

const SideNavSettings = ({ className }: SideNavSettingsProps) => {
  const pathname = usePathname();
  const { closeMenu } = useMobileMenuStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 300);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const filteredSettingsItems = sideNavSettingsItems
    .map((group) => {
      const matchGroup = group.title.toLocaleLowerCase().includes(debouncedSearchTerm.toLocaleLowerCase());
      const filteredItems = group.items.filter((item) => {
        return item.title.toLocaleLowerCase().includes(debouncedSearchTerm.toLocaleLowerCase());
      });

      if (matchGroup || filteredItems.length > 0) {
        return {
          ...group,
          items: matchGroup ? group.items : filteredItems,
        };
      }
      return null;
    })
    .filter(Boolean);

  const handleLinkClick = () => {
    // Close mobile menu when clicking on a link (only affects mobile)
    closeMenu();
  };

  return (
    <div className={cn('flex flex-col items-end justify-end', className)}>
      <div className="flex w-full flex-col gap-5 pt-7 md:w-64">
        <div>
          <InputGroup>
            <InputGroupInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div>
          {filteredSettingsItems.map((group) => {
            if (!group) return null;
            return (
              <div key={group.title} className="space-y-2">
                <h3 className="text-muted-foreground pl-6 text-sm">{group.title}</h3>
                <div className="relative">
                  {group.items.map((item) => {
                    const isActive = pathname === item.url;
                    const isHovered = hoveredItem === item.title;

                    return (
                      <div
                        key={item.title}
                        className="relative py-1 pr-4 pl-6"
                        onMouseEnter={() => setHoveredItem(item.title)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {/* Active Border */}
                        {isActive && (
                          <motion.div
                            layoutId="active-border"
                            className="bg-primary absolute top-0 bottom-0 left-0 w-0.5 rounded-r-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}

                        {/* Hover Indicator (Small Bar) */}
                        {isHovered && !isActive && (
                          <motion.div
                            layoutId="hover-indicator"
                            className="bg-primary/50 absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-r-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}

                        <Link
                          href={item.url}
                          onClick={handleLinkClick}
                          className={cn('flex items-center gap-2 transition-colors duration-200', {
                            'text-primary font-normal': isActive,
                            'text-muted-foreground': !isActive,
                          })}
                        >
                          <motion.div
                            className="flex items-center gap-2"
                            animate={{ x: isHovered ? 6 : 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          >
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </motion.div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNavSettings;
