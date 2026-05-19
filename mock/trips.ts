import { Viaje } from "@/types";

export const tripsMock: Viaje[] = [
  {
    id: "1",
    conductor_id: "1",
    vehiculo_id: "1",
    estado_viaje: "disponible",
    origen: "Facultad de Informática",
    destino: "Facultad de Contaduría",
    origenCoords: {
      latitude: 20.704,
      longitude: -100.443,
    },
    destinoCoords: {
      latitude: 20.588,
      longitude: -100.412,
    },
    fecha: "2026-04-27",
    hora_salida: "12:00",
    asientos_disponibles: 3,
    precio: 30,
  },
  {
    id: "2",
    conductor_id: "2",
    vehiculo_id: "2",
    estado_viaje: "disponible",
    origen: "Rectoría UAQ",
    destino: "Facultad de Ingeniería",
    origenCoords: {
      latitude: 20.593,
      longitude: -100.392,
    },
    destinoCoords: {
      latitude: 20.591,
      longitude: -100.409,
    },
    fecha: "2026-04-27",
    hora_salida: "13:30",
    asientos_disponibles: 2,
    precio: 25,
  },
];
