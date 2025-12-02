import { cn } from '@/lib/utils';

export default function PulsingLoader({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className="relative h-full w-full rounded-full before:absolute before:inset-0 before:animate-c-pulse-before before:rounded-full before:bg-primary/45 before:opacity-0 before:content-[''] after:absolute after:inset-0 after:animate-c-pulse-after after:rounded-full after:bg-primary/45 after:opacity-0 after:content-['']" />
    </div>
  );
}
