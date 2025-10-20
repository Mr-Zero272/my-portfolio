import { create } from 'zustand';

interface ICommentDetailState {
  commentId: string | null;
  open: boolean;
}

interface ICommentDetailStateActions {
  setField: <K extends keyof ICommentDetailState>(key: K, value: ICommentDetailState[K]) => void;
  reset: () => void;
}

const initialState: ICommentDetailState = {
  commentId: null,
  open: false,
};

export const useDetailCommentStore = create<ICommentDetailState & ICommentDetailStateActions>((set) => ({
  ...initialState,
  setField: (key, value) => set(() => ({ [key]: value })),
  reset: () => set(initialState),
}));
