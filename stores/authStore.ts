import { create } from 'zustand';
import { signInWith42, exchangeCodeForToken } from '../api/42Signin';
import { api, removeToken, setToken, setRefreshToken, getRefreshToken } from '../api/api';
import { UserProfile } from '../types/types';
import { map42UserToUserProfile } from '../lib/utils';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  get42MeProfile: () => Promise<UserProfile | void>;
  login: () => Promise<any>;
  authenticateWithCode: (code: string) => Promise<void>;
  logout: () => void;
  setUser: (user: UserProfile) => void;
  setAuthenticated: (auth: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  get42MeProfile: async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return;
      set({ isLoading: true, error: null });
      const { data } = await api.get('/me');
      const user = map42UserToUserProfile(data);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error: any) {
      console.error('Failed to get profile:', error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  login: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await signInWith42();

      if (result.access_token) {
        await get().get42MeProfile();
      }

      set({ isLoading: false });
      return result;
    } catch (error: any) {
      console.error('Login failed:', error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  authenticateWithCode: async (code: string) => {
    try {
      set({ isLoading: true, error: null });
      const tokenResult = await exchangeCodeForToken(code);

      if (tokenResult.access_token) {
        await get().get42MeProfile();
      } else {
        throw new Error('Failed to get access token');
      }

      set({ isLoading: false });
    } catch (error: any) {
      console.error('Authentication failed:', error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  logout: () => {
    removeToken();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  clearError: () => set({ error: null }),
})); 