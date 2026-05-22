import { Viaje } from '@/types';

export const historyMock: Viaje[] = [
    { id: 'h1', conductor_id: '1', vehiculo_id: '1', estado_viaje: 'completado', origen: 'Facultad de Informática', destino: 'Facultad de Ciencias Políticas y Sociales', fecha: '2026-04-10', hora_salida: '14:00', asientos_disponibles: 0, precio: 35 },
    { id: 'h2', conductor_id: '1', vehiculo_id: '1', estado_viaje: 'cancelado', origen: 'Rectoría UAQ', destino: 'Facultad de Ciencias Naturales', fecha: '2026-04-12', hora_salida: '09:00', asientos_disponibles: 3, precio: 40 },
    { id: 'h3', conductor_id: '2', vehiculo_id: '2', estado_viaje: 'completado', origen: 'Facultad de Artes', destino: 'Campus Centro Histórico', fecha: '2026-04-15', hora_salida: '07:30', asientos_disponibles: 1, precio: 50 },
    { id: 'h4', conductor_id: '1', vehiculo_id: '1', estado_viaje: 'completado', origen: 'Facultad de Medicina', destino: 'Campus Aeropuerto', fecha: '2026-04-18', hora_salida: '13:15', asientos_disponibles: 0, precio: 25 },
    { id: 'h5', conductor_id: '2', vehiculo_id: '2', estado_viaje: 'completado', origen: 'Facultad de Derecho', destino: 'Cerro de las Campanas', fecha: '2026-04-20', hora_salida: '18:00', asientos_disponibles: 0, precio: 20 },
    { id: 'h6', conductor_id: '1', vehiculo_id: '1', estado_viaje: 'cancelado', origen: 'Juriquilla', destino: 'Campus Aeropuerto', fecha: '2026-04-22', hora_salida: '11:00', asientos_disponibles: 4, precio: 45 },
    { id: 'h7', conductor_id: '2', vehiculo_id: '2', estado_viaje: 'completado', origen: 'Campus Centro Histórico', destino: 'Facultad de Informática', fecha: '2026-04-25', hora_salida: '08:00', asientos_disponibles: 2, precio: 30 },
    { id: 'h8', conductor_id: '1', vehiculo_id: '1', estado_viaje: 'completado', origen: 'Campus Colón', destino: 'Rectoría UAQ', fecha: '2026-04-28', hora_salida: '06:45', asientos_disponibles: 0, precio: 55 },
    { id: 'h9', conductor_id: '1', vehiculo_id: '1', estado_viaje: 'completado', origen: 'Cerro de las Campanas', destino: 'Campus Cadereyta', fecha: '2026-05-01', hora_salida: '15:30', asientos_disponibles: 1, precio: 35 },
    { id: 'h10', conductor_id: '2', vehiculo_id: '2', estado_viaje: 'cancelado', origen: 'Facultad de Ingeniería', destino: 'Campus Centro Histórico', fecha: '2026-05-03', hora_salida: '19:00', asientos_disponibles: 3, precio: 25 },
    { id: 'h11', conductor_id: '1', vehiculo_id: '1', estado_viaje: 'completado', origen: 'Facultad de Ingeniería', destino: 'Facultad de Ciencias Naturales', fecha: '2026-05-05', hora_salida: '10:00', asientos_disponibles: 0, precio: 40 },
    { id: 'h12', conductor_id: '2', vehiculo_id: '2', estado_viaje: 'completado', origen: 'Campus San Juan del Río', destino: 'Facultad de Derecho', fecha: '2026-05-08', hora_salida: '12:30', asientos_disponibles: 2, precio: 20 },
    { id: 'h13', conductor_id: '1', vehiculo_id: '1', estado_viaje: 'completado', origen: 'Rectoría UAQ', destino: 'Campus Tequisquiapan', fecha: '2026-05-10', hora_salida: '17:45', asientos_disponibles: 0, precio: 55 },
    { id: 'h14', conductor_id: '2', vehiculo_id: '2', estado_viaje: 'cancelado', origen: 'Juriquilla', destino: 'Facultad de Derecho', fecha: '2026-05-12', hora_salida: '14:00', asientos_disponibles: 4, precio: 30 },
    { id: 'h15', conductor_id: '1', vehiculo_id: '1', estado_viaje: 'completado', origen: 'Campus Centro Histórico', destino: 'Facultad de Ingeniería', fecha: '2026-05-13', hora_salida: '09:15', asientos_disponibles: 1, precio: 25 }
];