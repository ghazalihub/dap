import { create } from 'zustand';

interface AppState {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  notifications: any[];
  addNotification: (n: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentTab: 'discover',
  setCurrentTab: (currentTab) => set({ currentTab }),
  notifications: [],
  addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
}));
