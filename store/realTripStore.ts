import { tripsMock } from "@/mock/trips";
import { Viaje } from "@/types";
import { getEffectiveTripStatus } from "@/utils/tripDate";
import { create } from "zustand";

interface ViajesState {
  viajes: Viaje[];

  addViaje: (viaje: Viaje) => void;
  updateViajeEstado: (viajeId: string, estado: Viaje["estado_viaje"]) => void;
  iniciarViaje: (viajeId: string) => void;
  finalizarViaje: (viajeId: string) => void;
  sincronizarEstados: () => void;
  getViajeById: (viajeId: string) => Viaje | undefined;
  reducirAsientos: (viajeId: string, cantidad: number) => void;
}

export const useViajesStore = create<ViajesState>((set, get) => ({
  viajes: tripsMock.map((viaje) => ({
    ...viaje,
    estado_viaje: getEffectiveTripStatus(viaje),
  })),

  addViaje: (viaje) =>
    set((state) => ({
      viajes: [
        {
          ...viaje,
          estado_viaje: getEffectiveTripStatus(viaje),
        },
        ...state.viajes,
      ],
    })),

  updateViajeEstado: (viajeId, estado) =>
    set((state) => ({
      viajes: state.viajes.map((viaje) =>
        viaje.id === viajeId ? { ...viaje, estado_viaje: estado } : viaje,
      ),
    })),

  iniciarViaje: (viajeId) =>
    set((state) => ({
      viajes: state.viajes.map((viaje) =>
        viaje.id === viajeId ? { ...viaje, estado_viaje: "en curso" } : viaje,
      ),
    })),

  finalizarViaje: (viajeId) =>
    set((state) => ({
      viajes: state.viajes.map((viaje) =>
        viaje.id === viajeId ? { ...viaje, estado_viaje: "completado" } : viaje,
      ),
    })),

  sincronizarEstados: () =>
    set((state) => ({
      viajes: state.viajes.map((viaje) => ({
        ...viaje,
        estado_viaje: getEffectiveTripStatus(viaje),
      })),
    })),

  getViajeById: (viajeId) => {
    return get().viajes.find((viaje) => viaje.id === viajeId);
  },

  reducirAsientos: (viajeId, cantidad) =>
    set((state) => ({
      viajes: state.viajes.map((viaje) =>
        viaje.id === viajeId
          ? {
              ...viaje,
              asientos_disponibles: Math.max(
                0,
                viaje.asientos_disponibles - cantidad,
              ),
            }
          : viaje,
      ),
    })),
}));
