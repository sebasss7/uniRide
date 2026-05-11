import { Place } from "@/types/place";
import { create } from "zustand";

interface TripState {
  origen: Place | null;
  destino: Place | null;

  setOrigen: (place: Place) => void;
  setDestino: (place: Place) => void;
}

export const useTripStore = create<TripState>((set) => ({
  origen: null,
  destino: null,

  setOrigen: (value) => set({ origen: value }),
  setDestino: (value) => set({ destino: value }),
}));
