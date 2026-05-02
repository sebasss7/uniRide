import { create } from "zustand";

interface TripState {
  origen: string;
  destino: string;

  setOrigen: (value: string) => void;
  setDestino: (value: string) => void;
}

export const useTripStore = create<TripState>((set) => ({
  origen: "",
  destino: "",

  setOrigen: (value) => set({ origen: value }),
  setDestino: (value) => set({ destino: value }),
}));
