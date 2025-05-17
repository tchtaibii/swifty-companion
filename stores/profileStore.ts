import { create } from 'zustand';
import { UserProfile } from '../types/types';

interface ProfileState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  setProfile: (profile) => {
    set({ profile: profile });
  },
  clearProfile: () => {
    set({ profile: null });
  },
})); 