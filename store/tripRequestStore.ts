import { SolicitudViaje } from "@/types";
import { create } from "zustand";

interface SolicitudesState {
  solicitudes: SolicitudViaje[];

  crearSolicitud: (data: Omit<SolicitudViaje, "id" | "estado">) => void;
  aprobarSolicitud: (solicitudId: string) => void;
  denegarSolicitud: (solicitudId: string) => void;

  getSolicitudByPasajeroAndViaje: (
    pasajeroId: string,
    viajeId: string,
  ) => SolicitudViaje | undefined;
}

export const useSolicitudesStore = create<SolicitudesState>((set, get) => ({
  solicitudes: [],

  crearSolicitud: (data) => {
    const yaExiste = get().solicitudes.some(
      (solicitud) =>
        solicitud.viaje_id === data.viaje_id &&
        solicitud.pasajero_id === data.pasajero_id &&
        solicitud.estado !== "denegado",
    );

    if (yaExiste) return;

    const nuevaSolicitud: SolicitudViaje = {
      id: Date.now().toString(),
      viaje_id: data.viaje_id,
      pasajero_id: data.pasajero_id,
      forma_pago: data.forma_pago,
      asientos_reservados: data.asientos_reservados,
      total: data.total,
      estado: "en espera",
    };

    set((state) => ({
      solicitudes: [nuevaSolicitud, ...state.solicitudes],
    }));
  },

  aprobarSolicitud: (solicitudId) =>
    set((state) => ({
      solicitudes: state.solicitudes.map((solicitud) =>
        solicitud.id === solicitudId
          ? { ...solicitud, estado: "aprobado" }
          : solicitud,
      ),
    })),

  denegarSolicitud: (solicitudId) =>
    set((state) => ({
      solicitudes: state.solicitudes.map((solicitud) =>
        solicitud.id === solicitudId
          ? { ...solicitud, estado: "denegado" }
          : solicitud,
      ),
    })),

  getSolicitudByPasajeroAndViaje: (pasajeroId, viajeId) => {
    return get().solicitudes.find(
      (solicitud) =>
        solicitud.pasajero_id === pasajeroId && solicitud.viaje_id === viajeId,
    );
  },
}));
