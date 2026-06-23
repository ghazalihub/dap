import { create } from 'zustand';

interface AdminState {
  adminUser: any | null;
  setAdminUser: (user: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  adminUser: null,
  setAdminUser: (adminUser) => set({ adminUser }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
