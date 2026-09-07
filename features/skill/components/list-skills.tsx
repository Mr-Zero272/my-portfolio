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
import { GripVerticalIcon, PlusIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useBulkSortSkills } from '../hooks/mutations';
import { SkillWithAllRelations } from '../types';
import { SkillCard } from './skill-card';

type ListSkillsProps = {
  skills: SkillWithAllRelations[];
  mode: 'public' | 'private';
  renderActions?: (skill: SkillWithAllRelations) => React.ReactNode;
  onCreateNew?: () => void;
  isLoading?: boolean;
  error?: unknown;
};

export const ListSkills = ({
  skills,
  mode,
  renderActions,
  onCreateNew,
  isLoading,
  error,
}: ListSkillsProps) => {
  const [orderedSkills, setOrderedSkills] = useState<SkillWithAllRelations[]>([]);
  const { mutate: bulkSortSkills } = useBulkSortSkills();

  // Compute sorted initial skills
  const initialSortedSkills = useMemo(() => {
    const filtered = mode === 'public' ? skills.filter((skill) => skill.isVisible) : skills;
    return filtered.toSorted((a, b) => a.displayOrder - b.displayOrder);
  }, [skills, mode]);

  // Sync internal state when skills prop changes
  useEffect(() => {
    setOrderedSkills(initialSortedSkills);
  }, [initialSortedSkills]);

  // 500ms debounced bulk sort callback
  const debouncedBulkSort = useDebouncedCallback((newSkills: SkillWithAllRelations[]) => {
    const items = newSkills.map((skill, index) => ({
      id: skill.id,
      displayOrder: index,
    }));
    bulkSortSkills({ body: { items } });
  }, 500);

  const handleReorder = (newSkills: SkillWithAllRelations[]) => {
    setOrderedSkills(newSkills);
    debouncedBulkSort(newSkills);
  };

  return (
    <StateWrapper
      data={orderedSkills}
      isLoading={isLoading ?? false}
      error={error}
      fallbackEmpty={
        <StateUI
          title={mode === 'private' ? 'No Skills' : 'No Skills Found'}
          description={
            mode === 'private'
              ? 'Add your first skill to get started'
              : "It's empty here, check back later for more"
          }
          actions={
            mode === 'private' ? (
              <Button onClick={onCreateNew}>
                <PlusIcon />
                Add first skill
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
              getItemValue={(skill) => skill.id}
              orientation="mixed"
            >
              <SortableContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((skill) => {
                  const actions = renderActions ? renderActions(skill) : undefined;
                  return (
                    <SortableItem key={skill.id} value={skill.id}>
                      <SkillCard
                        skill={skill}
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
            {data.map((skill) => {
              const actions = renderActions ? renderActions(skill) : undefined;
              return <SkillCard key={skill.id} skill={skill} mode={mode} actions={actions} />;
            })}
          </div>
        );
      }}
    </StateWrapper>
  );
};
