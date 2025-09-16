'use client';

import { useSidebar } from '@/components/contexts/sidebar-context';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AlignLeft } from 'lucide-react';

const SidebarToggle = ({ className }: { className?: string }) => {
  const { toggle } = useSidebar();

  return (
    <AnimatedButton size="icon" variant="ghost" className={className} onClick={toggle}>
      <AlignLeft className="size-5" />
    </AnimatedButton>
  );
};

export default SidebarToggle;
