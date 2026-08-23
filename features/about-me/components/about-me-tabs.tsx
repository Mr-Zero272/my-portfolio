import { cn } from '@/lib/utils';
import { ArrowUpIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';

export type TabType = 'about' | 'education' | 'skills' | 'experiences';

export const aboutTabs = [
  {
    label: 'About me',
    value: 'about',
  },
  {
    label: 'Education',
    value: 'education',
  },
  {
    label: 'Skills',
    value: 'skills',
  },
  {
    label: 'Experience',
    value: 'experiences',
  },
] satisfies { label: string; value: TabType }[];

export const AboutMeTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange?: (value: TabType) => void;
}) => {
  return (
    <div className="flex flex-row flex-wrap gap-3 md:flex-col">
      {aboutTabs.map((tab) => (
        <AboutMeTab
          key={tab.value}
          label={tab.label}
          value={tab.value}
          active={activeTab === tab.value}
          onTabChange={onTabChange}
        />
      ))}
    </div>
  );
};

export const AboutMeTab = ({
  label,
  value,
  active = false,
  onTabChange,
}: {
  label: string;
  value: TabType;
  active?: boolean;
  onTabChange?: (value: TabType) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const variants = useMemo(
    () => ({
      initial: { opacity: 0, y: 15 },
      show: { opacity: 100, y: 0, transition: { delay: 0.1, duration: 0.4 } },
      hidden: { opacity: 0, y: -15, transition: { duration: 0.3 } },
    }),
    [],
  );
  return (
    <div
      className={cn(
        'flex w-fit cursor-pointer items-center justify-between rounded-md border border-transparent px-5 py-3 shadow-md hover:border-slate-100 md:w-full',
        {
          'bg-black text-white shadow-none dark:bg-white dark:text-black': active,
        },
      )}
      onClick={() => onTabChange?.(value)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p>{label}</p>
      <AnimatePresence mode="wait">
        {hovered && (
          <motion.span
            className="hidden md:inline-block"
            variants={variants}
            key={'hovered'}
            initial={'initial'}
            animate={'show'}
            exit={'hidden'}
          >
            <ArrowUpIcon className="size-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
