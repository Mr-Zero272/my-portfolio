import { create } from 'zustand';

interface IGlobalSettingsState {
  isTransitionPageEnabled: boolean;
}

interface IGlobalSettingsActions {
  setField: <K extends keyof IGlobalSettingsState>(field: K, value: IGlobalSettingsState[K]) => void;
  toggleTransitionPage: () => void;
  setIsTransitionPageEnabled: (enabled: boolean) => void;
}

const initialState: IGlobalSettingsState = {
  isTransitionPageEnabled: true,
};

export const useSettingsStore = create<IGlobalSettingsState & IGlobalSettingsActions>((set) => ({
  ...initialState,
  setField: (field, value) => set({ [field]: value } as Pick<IGlobalSettingsState, keyof IGlobalSettingsState>),
  toggleTransitionPage: () => set((state) => ({ isTransitionPageEnabled: !state.isTransitionPageEnabled })),
  setIsTransitionPageEnabled: (enabled: boolean) => set({ isTransitionPageEnabled: enabled }),
}));
