// store/cursorStore.ts
import { create } from 'zustand';

export type CursorType = 'default' | 'link' | 'button' | 'text' | 'hidden' | 'custom1' | 'custom2';

interface CursorState {
  type: CursorType;
  data?: any;
  setType: (type: CursorType, data?: any) => void;
  reset: () => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  type: 'default',
  data: null,
  setType: (type, data) => set({ type, data }),
  reset: () => set({ type: 'default', data: null }),
}));
