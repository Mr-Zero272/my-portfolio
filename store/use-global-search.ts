import { create } from 'zustand';

interface GlobalSearchState {
  open: boolean;
}

interface GlobalSearchActions {
  setField: <K extends keyof GlobalSearchState>(field: K, value: GlobalSearchState[K]) => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const initialState: GlobalSearchState = {
  open: false,
};

export const useGlobalSearch = create<GlobalSearchState & GlobalSearchActions>((set) => ({
  ...initialState,
  setField: (field, value) => set(() => ({ [field]: value })),
  openSearch: () => set(() => ({ open: true })),
  closeSearch: () => set(() => ({ open: false })),
  toggleSearch: () => set((state) => ({ open: !state.open })),
}));

// Hook tiện ích để sử dụng global search actions
export const useGlobalSearchActions = () => {
  const { openSearch, closeSearch, toggleSearch } = useGlobalSearch();
  return { openSearch, closeSearch, toggleSearch };
};
