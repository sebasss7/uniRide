// store/useViajesStore.ts

import { tripsMock } from "@/mock/trips";
import { Viaje } from "@/types";
import { create } from "zustand";

interface ViajesState {
  viajes: Viaje[];

  addViaje: (viaje: Viaje) => void;
  updateViajeEstado: (viajeId: string, estado: Viaje["estado_viaje"]) => void;
  getViajeById: (viajeId: string) => Viaje | undefined;
}

export const useViajesStore = create<ViajesState>((set, get) => ({
  viajes: tripsMock,

  addViaje: (viaje) =>
    set((state) => ({
      viajes: [viaje, ...state.viajes],
    })),

  updateViajeEstado: (viajeId, estado) =>
    set((state) => ({
      viajes: state.viajes.map((viaje) =>
        viaje.id === viajeId ? { ...viaje, estado_viaje: estado } : viaje,
      ),
    })),

  getViajeById: (viajeId) => {
    return get().viajes.find((viaje) => viaje.id === viajeId);
  },
}));
