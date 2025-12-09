import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  isFirstTime?: boolean;
}

interface Action {
  setIsFirstTime: (val: boolean) => void;
}

export const useOnboarding = create<State & Action>()(
  persist(
    (set) => ({
      isFirstTime: undefined,
      setIsFirstTime(val) {
        set({
          isFirstTime: val,
        });
      },
    }),
    {
      name: 'store/onboarding',
      version: 1,
      onRehydrateStorage(state) {
        if (typeof state.isFirstTime === 'undefined') {
          state.isFirstTime = true;
        }
      },
    },
  ),
);
