import { create } from 'zustand';

interface ICommentStore {
  replyingToCommentId: string | null;
  replyToUsername: string | null;
}

interface ICommentStoreActions {
  setField: <K extends keyof ICommentStore>(key: K, value: ICommentStore[K]) => void;
  reset: () => void;
}

const initialState: ICommentStore = {
  replyingToCommentId: null,
  replyToUsername: null,
};

export const useCommentStore = create<ICommentStore & ICommentStoreActions>((set) => ({
  ...initialState,
  setField: (key, value) =>
    set(() => ({
      ...initialState,
      [key]: value,
    })),

  reset: () => set(() => ({ ...initialState })),
}));
