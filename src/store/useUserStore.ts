import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Child, User } from "../types/types";

interface UserState {
  accessToken: string | null;
  user: User | null;
  role: "PARENT" | "ADMIN" | null;
  activeChild: Child | null;
  _hasHydrated: boolean;

  setAuth: (token: string, user: User) => void;
  setActiveChild: (child: Child) => void;
  logout: () => void;
  setHasHydration: (val: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      role: null,
      activeChild: null,
      _hasHydrated: false,

      setAuth: (token, user) => {
        localStorage.setItem("accessToken", token);
        set({ accessToken: token, user, role: user.role });
      },

      setActiveChild: (child) => set({ activeChild: child }),

      logout: () => {
        localStorage.removeItem("accessToken");
        set({ accessToken: null, user: null, role: null, activeChild: null });
      },

      setHasHydration: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: "littlestep-user",
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydration(true);
      },
    },
  ),
);
