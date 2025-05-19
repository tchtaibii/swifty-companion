import { create } from 'zustand';

interface networkState {
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}

export const useNetworkStore = create<networkState>((set) => ({
  isConnected: true,
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
})); 