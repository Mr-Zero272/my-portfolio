'use client';

import StateUI from '@/components/shared/state-ui';
import StateWrapper from '@/components/shared/state-wrapper';
import { Button } from '@/components/ui/button';
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from '@/components/ui/sortable';
import { useDebouncedCallback } from '@mantine/hooks';
import { SocialLink } from '@prisma/client';
import { GripVerticalIcon, PlusIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useBulkSortSocialLinks } from '../hooks/mutations';
import { SocialLinkCard } from './social-link-card';

type ListSocialLinksProps = {
  socialLinks: SocialLink[];
  mode: 'public' | 'private';
  renderActions?: (socialLink: SocialLink) => React.ReactNode;
  onCreateNew?: () => void;
  isLoading?: boolean;
  error?: unknown;
};

export const ListSocialLinks = ({
  socialLinks,
  mode,
  renderActions,
  onCreateNew,
  isLoading,
  error,
}: ListSocialLinksProps) => {
  const [orderedSocialLinks, setOrderedSocialLinks] = useState<SocialLink[]>([]);
  const { mutate: bulkSortSocialLinks } = useBulkSortSocialLinks();

  const initialSortedSocialLinks = useMemo(() => {
    const filtered = mode === 'public' ? socialLinks.filter((link) => link.isActive) : socialLinks;
    return filtered.toSorted((a, b) => a.displayOrder - b.displayOrder);
  }, [socialLinks, mode]);

  useEffect(() => {
    setOrderedSocialLinks(initialSortedSocialLinks);
  }, [initialSortedSocialLinks]);

  const debouncedBulkSort = useDebouncedCallback((newSocialLinks: SocialLink[]) => {
    const items = newSocialLinks.map((link, index) => ({
      id: link.id,
      displayOrder: index,
    }));
    bulkSortSocialLinks({ body: { items } });
  }, 500);

  const handleReorder = (newSocialLinks: SocialLink[]) => {
    setOrderedSocialLinks(newSocialLinks);
    debouncedBulkSort(newSocialLinks);
  };

  return (
    <StateWrapper
      data={orderedSocialLinks}
      isLoading={isLoading ?? false}
      error={error}
      fallbackEmpty={
        <StateUI
          title={mode === 'private' ? 'No Social Links' : 'No Social Links Found'}
          description={
            mode === 'private'
              ? 'Add your first social link to get started'
              : "It's empty here, check back later for more"
          }
          actions={
            mode === 'private' ? (
              <Button onClick={onCreateNew}>
                <PlusIcon />
                Add first social link
              </Button>
            ) : undefined
          }
        />
      }
    >
      {(data) => {
        if (mode === 'private') {
          return (
            <Sortable
              value={data}
              onValueChange={handleReorder}
              getItemValue={(link) => link.id}
              orientation="mixed"
            >
              <SortableContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((link) => {
                  const actions = renderActions ? renderActions(link) : undefined;
                  return (
                    <SortableItem key={link.id} value={link.id}>
                      <SocialLinkCard
                        socialLink={link}
                        mode={mode}
                        actions={actions}
                        dragHandle={
                          <SortableItemHandle
                            className="text-muted-foreground hover:bg-accent hover:text-foreground flex size-8 cursor-grab items-center justify-center rounded-md transition-colors active:cursor-grabbing"
                            aria-label="Drag to reorder"
                          >
                            <GripVerticalIcon className="size-4" />
                          </SortableItemHandle>
                        }
                      />
                    </SortableItem>
                  );
                })}
              </SortableContent>
            </Sortable>
          );
        }

        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((link) => {
              const actions = renderActions ? renderActions(link) : undefined;
              return (
                <SocialLinkCard key={link.id} socialLink={link} mode={mode} actions={actions} />
              );
            })}
          </div>
        );
      }}
    </StateWrapper>
  );
};
