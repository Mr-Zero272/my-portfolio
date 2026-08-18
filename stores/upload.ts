import type { UploadTask } from '@/lib/upload/types';
import { create } from 'zustand';

// ─── State ──────────────────────────────────────────────────────────────────

interface UploadStoreState {
  /** All upload tasks keyed by unique task ID. */
  tasks: Map<string, UploadTask>;

  addTask: (task: UploadTask) => void;
  updateTask: (id: string, patch: Partial<UploadTask>) => void;
  removeTask: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  getTask: (id: string) => UploadTask | undefined;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useUploadStore = create<UploadStoreState>((set, get) => ({
  tasks: new Map(),

  addTask: (task) => {
    set((state) => {
      const tasks = new Map(state.tasks);
      tasks.set(task.id, task);
      return { tasks };
    });
  },

  updateTask: (id, patch) => {
    set((state) => {
      const tasks = new Map(state.tasks);
      const existing = tasks.get(id);
      if (existing) {
        tasks.set(id, { ...existing, ...patch, updatedAt: new Date().toISOString() });
      }
      return { tasks };
    });
  },

  removeTask: (id) => {
    set((state) => {
      const tasks = new Map(state.tasks);
      tasks.delete(id);
      return { tasks };
    });
  },

  clearCompleted: () => {
    set((state) => {
      const tasks = new Map(state.tasks);
      for (const [id, task] of tasks) {
        if (task.status === 'uploaded' || task.status === 'error') {
          tasks.delete(id);
        }
      }
      return { tasks };
    });
  },

  clearAll: () => {
    set({ tasks: new Map() });
  },

  getTask: (id) => get().tasks.get(id),
}));

// ─── Selectors ──────────────────────────────────────────────────────────────

export const selectActiveTasks = (state: UploadStoreState): UploadTask[] =>
  Array.from(state.tasks.values()).filter((t) => t.status === 'uploading' || t.status === 'queued');

export const selectTaskById =
  (id: string) =>
  (state: UploadStoreState): UploadTask | undefined =>
    state.tasks.get(id);

/** Subscribe nhiều task một lúc (multiple upload) — dùng kèm `useShallow`. */
export const selectTasksByIds =
  (ids: string[]) =>
  (state: UploadStoreState): UploadTask[] =>
    ids.map((id) => state.tasks.get(id)).filter((task): task is UploadTask => Boolean(task));
