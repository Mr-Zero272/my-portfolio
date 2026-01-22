import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IGlobalSettingsState {
  isTransitionPageEnabled: boolean;
  isAnimationCursorEnabled: boolean;
  cursorStyle: 'default' | 'geometric' | 'glow' | 'ripple' | 'trail' | 'crosshair' | 'neon' | 'diamond' | 'pulse';
}

interface IGlobalSettingsActions {
  setIsTransitionPageEnabled: (enabled: boolean) => void;
  setIsAnimationCursorEnabled: (enabled: boolean) => void;
  setCursorStyle: (
    style: 'default' | 'geometric' | 'glow' | 'ripple' | 'trail' | 'crosshair' | 'neon' | 'diamond' | 'pulse',
  ) => void;
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
