import { Resena } from "@/types";
import { create } from "zustand";

interface ResenasState {
  resenas: Resena[];

  crearResena: (data: Omit<Resena, "id" | "fecha">) => boolean;
}

export const useResenasStore = create<ResenasState>((set, get) => ({
  resenas: [],

  crearResena: (data) => {
    const yaExiste = get().resenas.some(
      (resena) =>
        resena.viaje_id === data.viaje_id &&
        resena.pasajero_id === data.pasajero_id,
    );

    if (yaExiste) return false;

    const nuevaResena: Resena = {
      id: Date.now().toString(),
      viaje_id: data.viaje_id,
      conductor_id: data.conductor_id,
      pasajero_id: data.pasajero_id,
      puntuacion: data.puntuacion,
      comentario: data.comentario,
      fecha: new Date().toISOString().split("T")[0],
    };

    set((state) => ({
      resenas: [nuevaResena, ...state.resenas],
    }));

    return true;
  },
}));
