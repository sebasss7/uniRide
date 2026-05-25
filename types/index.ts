import { LatLng } from "./latLng";

export interface Usuario {
    id: string;
    rol: 1 | 2; // 1: pasajero, 2: conductor
    imagen_usuario?: string;
    nombre: string;
    nacimiento: string;
    descripcion?: string;
    correo: string;
    password: string;
    telefono: string;
    verificado: boolean;
}

export interface Vehiculo {
    id: string;
    usuario_id: string;
    imagen_vehiculo?: string;
    licencia: string;
    marca: string;
    modelo: string;
    placas: string;
    color: string;
}

export interface Viaje {
    id: string;
    conductor_id: string;
    vehiculo_id: string;
    estado_viaje: "disponible" | "completado" | "cancelado" | "en curso";

    origen: string;
    destino: string;

    origenCoords: LatLng;
    destinoCoords: LatLng;

    fecha: string;
    hora_salida: string;
    asientos_disponibles: number;
    precio: number;
}

export interface SolicitudViaje {
    id: string;
    viaje_id: string;
    pasajero_id: string;
    estado: "aprobado" | "denegado" | "en espera";
    forma_pago: 1 | 2;
    asientos_reservados: number;
    total: number;
}

export interface Resena {
    id: string;
    conductor_id: string;
    pasajero_id: string;
    puntuacion: number;
    comentario: string;
    fecha: string;
}

export interface Mensaje {
    id: string;
    chat_id: string;
    id_emisor: string;
    contenido: string;
    fecha: string;
    hora: string;
    leido: boolean;
}

export interface Chat {
    id: string;
    participantes: string[];
    viaje_id?: string; //Cada chat pertenece a un viaje en específico
}