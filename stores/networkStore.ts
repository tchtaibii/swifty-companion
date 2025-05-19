import { create } from 'zustand';

interface networkState {
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}

export const useNetworkStore = create<networkState>((set) => ({
  isConnected: false,
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
})); 