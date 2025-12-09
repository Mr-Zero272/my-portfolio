'use client';

import { useSettingsStore } from '@/store/use-settings';
import AnimatedCursor from './animated-cursor';

const CursorSetting = () => {
  const { isAnimationCursorEnabled } = useSettingsStore();

  if (!isAnimationCursorEnabled) return null;

  return <AnimatedCursor />;
};

export default CursorSetting;
