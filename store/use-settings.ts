import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IGlobalSettingsState {
  isTransitionPageEnabled: boolean;
  isAnimationCursorEnabled: boolean;
}

interface IGlobalSettingsActions {
  setField: <K extends keyof IGlobalSettingsState>(field: K, value: IGlobalSettingsState[K]) => void;
  setIsTransitionPageEnabled: (enabled: boolean) => void;
  setIsAnimationCursorEnabled: (enabled: boolean) => void;
  resetToDefault: () => void;
}

const initialState: IGlobalSettingsState = {
  isTransitionPageEnabled: true,
  isAnimationCursorEnabled: false,
};

export const useSettingsStore = create<IGlobalSettingsState & IGlobalSettingsActions>()(
  persist(
    (set) => ({
      ...initialState,
      setField: (field, value) => set({ [field]: value } as Pick<IGlobalSettingsState, keyof IGlobalSettingsState>),
      setIsTransitionPageEnabled: (enabled: boolean) => set({ isTransitionPageEnabled: enabled }),
      setIsAnimationCursorEnabled: (enabled: boolean) => set({ isAnimationCursorEnabled: enabled }),
      resetToDefault: () => set(initialState),
    }),
    { name: 'store/global-settings' },
  ),
);
