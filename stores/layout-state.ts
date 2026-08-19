import { create } from 'zustand';

interface State {
  isBottomNavOpen: boolean;
}

interface Actions {
  setIsBottomNavOpen: (value: boolean) => void;
  setField: <T extends keyof State>(field: T, value: State[T]) => void;
}

export const useLayoutState = create<State & Actions>((set) => ({
  isBottomNavOpen: false,
  setIsBottomNavOpen: (value) => set({ isBottomNavOpen: value }),
  setField: (field, value) => set({ [field]: value }),
}));
