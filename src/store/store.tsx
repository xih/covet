import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MapState {
  addressCounter: number;
  increaseAddressCounter: (by: number) => void;
  isFirstTimeVisit: boolean;
  markVisited: () => void;
  firstVisitTimeStamp: Date | null;
  setfirstVisitTimeStamp: () => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      addressCounter: 0,
      increaseAddressCounter: () =>
        set((state) => ({ addressCounter: state.addressCounter + 1 })),
      isFirstTimeVisit: true,
      markVisited: () => set({ isFirstTimeVisit: false }),
      firstVisitTimeStamp: null,
      setfirstVisitTimeStamp: () => set({ firstVisitTimeStamp: new Date() }),
    }),
    {
      name: "map-clicks-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
