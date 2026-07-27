import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "../../types/auth.type";

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,


            setAuth: (accessToken: string, refreshToken : string) => {
                set({
                    accessToken,
                    refreshToken,
                });
            },

            setUser: (user) => set({ user }),
            isAuthenticated: () => {
                const { user, accessToken } = get();
                return !!(user && accessToken);
            },

            logout: () => {
                window.location.href = '/';
                set({
                    accessToken: null,
                    user: null,
                    refreshToken: null
                });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);