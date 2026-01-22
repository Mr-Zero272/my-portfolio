'use client';

import { useSettingsStore } from '@/store/use-settings';
import AnimatedCursor from './animated-cursor';

const CursorSetting = () => {
  const { isAnimationCursorEnabled, cursorStyle } = useSettingsStore();

  return <AnimatedCursor key="animated" enabled={isAnimationCursorEnabled} type={cursorStyle} />;
};

export default CursorSetting;
