import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MapState {
  addressCounter: number;
  increaseAddressCounter: (by: number) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      addressCounter: 0,
      increaseAddressCounter: () =>
        set((state) => ({ addressCounter: state.addressCounter + 1 })),
    }),
    {
      name: "map-clicks-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
