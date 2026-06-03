import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCommandMenuOpen: boolean;
  setCommandMenuOpen: (isOpen: boolean) => void;
  userAvatar: string;
  setUserAvatar: (url: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      isCommandMenuOpen: false,
      setCommandMenuOpen: (isOpen) => set({ isCommandMenuOpen: isOpen }),
      userAvatar: "https://github.com/shadcn.png",
      setUserAvatar: (url) => set({ userAvatar: url }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ userAvatar: state.userAvatar, isSidebarOpen: state.isSidebarOpen }),
    }
  )
);
