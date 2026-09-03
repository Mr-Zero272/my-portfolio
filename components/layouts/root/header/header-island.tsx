'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@mantine/hooks';
import { motion, useReducedMotion } from 'motion/react';
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * A springy, morphing "island" pill (dynamic-island style) built with a
 * compound-components API so the *animation layout* is reusable:
 *
 *   <HeaderIsland.Root>
 *     <HomeButton />                                   (collapsed header row)
 *     <HeaderIsland.Item value="music">...</HeaderIsland.Item>   (a trigger)
 *     <HeaderIsland.Panel value="music">...</HeaderIsland.Panel> (expanded view)
 *   </HeaderIsland.Root>
 *
 * Any non-Panel child of Root renders in the collapsed row; Panels are matched
 * by <Item> `value`. Adding a future view (e.g. "alarm") is just a new
 * <Item>/<Panel> pair — no changes to this core.
 *
 * - Clicking an <Item> morphs the whole pill (spring `layout`) to show the
 *   matching <Panel>; clicking it again collapses back to the idle row.
 * - The pill also collapses on click-outside or the Escape key.
 * - The expanded width is clamped so it never overflows small screens.
 * - `useReducedMotion` is respected (all morphing disabled).
 */

const ISLAND_SPRING = { type: 'spring', bounce: 0.4, duration: 0.45 } as const;
const CONTENT_SPRING = { type: 'spring', bounce: 0.35, duration: 0.35 } as const;
const NO_MOTION = { duration: 0 } as const;

interface IslandContextValue {
  activeView: string | null;
  setActiveView: (view: string | null) => void;
}

const IslandContext = createContext<IslandContextValue | null>(null);

export const useHeaderIsland = (): IslandContextValue => {
  const ctx = useContext(IslandContext);
  if (!ctx) {
    throw new Error('useHeaderIsland must be used within <HeaderIsland.Root>');
  }
  return ctx;
};

export interface IslandItemProps extends ButtonProps {
  /** The view this trigger opens (must match a <Panel> `value`). */
  value: string;
}

function IslandItem({ value, className, children, onClick, ...rest }: IslandItemProps) {
  const { activeView, setActiveView } = useHeaderIsland();
  const isActive = activeView === value;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-expanded={isActive}
      className={cn('relative', className)}
      onClick={(event) => {
        onClick?.(event);
        // Toggle: opening the already-active view collapses back to the bar.
        setActiveView(isActive ? null : value);
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}

export interface IslandPanelProps {
  /** The view id this panel provides (must match an <Item> `value`). */
  value: string;
  children?: ReactNode;
}

/** Marker only: <Root> reads its children; Panels are rendered when active. */
function IslandPanel(_props: IslandPanelProps) {
  void _props; // props are only inspected by <Root>, never used here
  return null;
}

export interface IslandRootProps {
  children?: ReactNode;
  /** Extra classes for the pill shell (kept in addition to the default look). */
  className?: string;
  /** Initial view for the uncontrolled mode (default: collapsed bar). */
  defaultView?: string | null;
  /** Controlled active view (collapsed bar when `null`). */
  view?: string | null;
  /** Controlled-mode callback. */
  onViewChange?: (view: string | null) => void;
}

function IslandRoot({
  children,
  className,
  defaultView = null,
  view,
  onViewChange,
}: IslandRootProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalView, setInternalView] = useState<string | null>(defaultView);
  const isControlled = view !== undefined;

  const setActiveView = useCallback(
    (next: string | null) => {
      if (isControlled) {
        onViewChange?.(next);
      } else {
        setInternalView(next);
      }
    },
    [isControlled, onViewChange],
  );

  const activeView = isControlled ? (view ?? null) : internalView;

  // <Panel> children become expandable views; everything else is the idle bar.
  const { barChildren, panels } = useMemo(() => {
    const barChildren: ReactNode[] = [];
    const panels = new Map<string, ReactNode>();
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === IslandPanel) {
        const props = child.props as IslandPanelProps;
        panels.set(props.value, props.children);
      } else if (child !== null && child !== undefined && typeof child !== 'boolean') {
        barChildren.push(child);
      }
    });
    return { barChildren, panels };
  }, [children]);

  const pillTransition = shouldReduceMotion ? NO_MOTION : ISLAND_SPRING;
  const contentTransition = shouldReduceMotion ? NO_MOTION : CONTENT_SPRING;

  // Click-outside collapses back to the idle bar (a no-op while already idle).
  const handleClickOutside = useCallback(() => {
    setActiveView(null);
  }, [setActiveView]);
  const islandRef = useClickOutside<HTMLDivElement>(handleClickOutside);

  // Escape collapses the expanded view.
  useEffect(() => {
    if (!activeView) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveView(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeView, setActiveView]);

  const contextValue = useMemo(() => ({ activeView, setActiveView }), [activeView, setActiveView]);

  return (
    <IslandContext value={contextValue}>
      <motion.div
        ref={islandRef}
        layout
        transition={pillTransition}
        className={cn(
          'flex w-fit max-w-[calc(100vw-2rem)] items-center overflow-hidden rounded-full bg-neutral-100/30 px-3 py-2 backdrop-blur-sm',
          className,
        )}
      >
        <motion.div
          key={activeView ?? 'island-idle'}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { filter: 'blur(4px)', opacity: 0, scale: 0.94, originX: 0.5, originY: 0.5 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : { filter: 'blur(0px)', opacity: 1, scale: 1 }
          }
          transition={contentTransition}
          className="flex w-fit items-center justify-center"
        >
          {activeView ? (
            panels.has(activeView) ? (
              panels.get(activeView)
            ) : null
          ) : (
            <div className="flex items-center justify-center gap-2">{barChildren}</div>
          )}
        </motion.div>
      </motion.div>
    </IslandContext>
  );
}

export const HeaderIsland = {
  Root: IslandRoot,
  Item: IslandItem,
  Panel: IslandPanel,
};
