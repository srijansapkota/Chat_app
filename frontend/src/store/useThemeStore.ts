import { create } from "zustand";

interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: localStorage.getItem("chatTheme") || "dracula",
  setTheme: (theme) => {
    localStorage.setItem("chatTheme", theme);
    set({ theme });
  },
}));
