'use client';

import { useSettingsStore } from '@/store/use-settings';
import AnimatedCursor from './animated-cursor';

const CursorSetting = () => {
  const { isAnimationCursorEnabled } = useSettingsStore();

  return <AnimatedCursor enabled={isAnimationCursorEnabled} />;
};

export default CursorSetting;
