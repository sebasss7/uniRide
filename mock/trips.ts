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
    conductor_id: "1",
    vehiculo_id: "1",
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
  {
    id: "3",
    conductor_id: "1",
    vehiculo_id: "1",
    estado_viaje: "disponible",
    origen: "Coahuila 215",
    destino: "Facultad de Informatica UAQ",
    origenCoords: {
      latitude: 20.648909741630924,
      longitude: -100.45662792299761,
    },
    destinoCoords: {
      latitude: 20.704419440227355,
      longitude: -100.44388253285416,
    },
    fecha: "2026-05-26",
    hora_salida: "22:00",
    asientos_disponibles: 3,
    precio: 30,
  },
];
