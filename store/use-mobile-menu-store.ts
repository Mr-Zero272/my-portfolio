import { create } from 'zustand';

interface MobileMenuState {
  isOpen: boolean;
}

interface MobileMenuActions {
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

const initialState: MobileMenuState = {
  isOpen: false,
};

export const useMobileMenuStore = create<MobileMenuState & MobileMenuActions>((set) => ({
  ...initialState,
  openMenu: () => set(() => ({ isOpen: true })),
  closeMenu: () => set(() => ({ isOpen: false })),
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
}));

// Hook tiện ích để sử dụng mobile menu actions
export const useMobileMenuActions = () => {
  const { openMenu, closeMenu, toggleMenu } = useMobileMenuStore();
  return { openMenu, closeMenu, toggleMenu };
};
