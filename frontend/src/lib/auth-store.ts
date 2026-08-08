import type { User } from 'firebase/auth';
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  isInitializing: boolean;
  setUser: (user: User | null) => void;
}

// App-wide store: a router guard (protected layout) and a logout button
// both need the current user, and future features will need the current uid.
// See docs/recipes/zustand.md and docs/decisions/0011-zustand.md.
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isInitializing: true,
  setUser: (user) => set({ user, isInitializing: false }),
}));
