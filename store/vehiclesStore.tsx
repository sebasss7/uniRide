import { vehiclesMock } from "@/mock/vehicles";
import { Vehiculo } from "@/types";
import { create } from "zustand";

interface VehiculoState {
    vehiculos: Vehiculo[];
    agregarVehiculo: (vehiculo: Omit<Vehiculo, "id">) => void;
    editarVehiculo: (id: string, datos: Partial<Omit<Vehiculo, "id">>) => void;
    eliminarVehiculo: (id: string) => void;
    getVehiculosDeUsuario: (usuario_id: string) => Vehiculo[];
}

export const useVehiculoStore = create<VehiculoState>((set, get) => ({
    vehiculos: vehiclesMock,

    agregarVehiculo: (vehiculo) => {
        const nuevo: Vehiculo = {
            ...vehiculo,
            id: String(Date.now()),
        };
        set((state) => ({ vehiculos: [...state.vehiculos, nuevo] }));
    },

    editarVehiculo: (id, datos) => {
        set((state) => ({
            vehiculos: state.vehiculos.map((v) =>
                v.id === id ? { ...v, ...datos } : v
            ),
        }));
    },

    eliminarVehiculo: (id) => {
        set((state) => ({
            vehiculos: state.vehiculos.filter((v) => v.id !== id),
        }));
    },

    getVehiculosDeUsuario: (usuario_id) => {
        return get().vehiculos.filter((v) => v.usuario_id === usuario_id);
    },
}));
