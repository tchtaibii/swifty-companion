import { create } from 'zustand';
import { signInWith42 } from '../api/42Signin';
import { api, removeToken } from '../api/api';
import { UserProfile } from '../types/types';
import { map42UserToUserProfile } from '../lib/utils';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  get42MeProfile: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => void;
  setUser: (user: UserProfile) => void;
  setAuthenticated: (auth: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  get42MeProfile: async () => {
    const { data } = await api.get('/me');
    const user = map42UserToUserProfile(data);
    set({ user, isAuthenticated: true });
  },
  login: async () => {
    console.log("entering login");
    await signInWith42();
    console.log("after signInWith42");
    get().get42MeProfile();
  },
  logout: () => {
    removeToken();
    set({ user: null, isAuthenticated: false })
},
  setUser: (user) => set({ user }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
})); 