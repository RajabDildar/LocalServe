import { create } from "zustand";

interface LocationState {
  lat: number | null;
  lng: number | null;
  address: string | undefined;
  setLocation: (lat: number, lng: number, address?: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  lat: null,
  lng: null,
  address: undefined,
  setLocation: (lat, lng, address) => set({ lat, lng, address }),
}));
