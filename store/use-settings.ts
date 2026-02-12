import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CursorStyle = 'default' | 'geometric' | 'glow';

interface IGlobalSettingsState {
  isTransitionPageEnabled: boolean;
  isAnimationCursorEnabled: boolean;
  cursorStyle: CursorStyle;
}

interface IGlobalSettingsActions {
  setIsTransitionPageEnabled: (enabled: boolean) => void;
  setIsAnimationCursorEnabled: (enabled: boolean) => void;
  setCursorStyle: (style: CursorStyle) => void;
  resetToDefault: () => void;
}

const initialState: IGlobalSettingsState = {
  isTransitionPageEnabled: true,
  isAnimationCursorEnabled: false,
  cursorStyle: 'default',
};

export const useSettingsStore = create<IGlobalSettingsState & IGlobalSettingsActions>()(
  persist(
    (set) => ({
      ...initialState,
      setIsTransitionPageEnabled: (enabled: boolean) => set({ isTransitionPageEnabled: enabled }),
      setIsAnimationCursorEnabled: (enabled: boolean) => set({ isAnimationCursorEnabled: enabled }),
      setCursorStyle: (style) => set({ cursorStyle: style }),
      resetToDefault: () => set(initialState),
    }),
    { name: 'store/global-settings' },
  ),
);
