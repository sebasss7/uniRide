import { Viaje } from "@/types";

const TEST_NOW: Date | null = null;

// Para pruebas puedes usar esto:
// const TEST_NOW: Date | null = new Date(2026, 2, 19, 12, 0);
// Ojo: marzo es 2 porque los meses en JS van de 0 a 11.

export const getNow = () => {
  return TEST_NOW ?? new Date();
};

export const parseTripDateTime = (fecha: string, hora: string) => {
  const [year, month, day] = fecha.split("-").map(Number);
  const [hours, minutes] = hora.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes || 0, 0);
};

export const isTripPast = (viaje: Viaje) => {
  const tripDate = parseTripDateTime(viaje.fecha, viaje.hora_salida);

  return tripDate.getTime() < getNow().getTime();
};

export const getEffectiveTripStatus = (viaje: Viaje): Viaje["estado_viaje"] => {
  if (viaje.estado_viaje === "cancelado") return "cancelado";
  if (viaje.estado_viaje === "completado") return "completado";
  if (viaje.estado_viaje === "en curso") return "en curso";

  if (viaje.estado_viaje === "disponible" && isTripPast(viaje)) {
    return "completado";
  }

  return "disponible";
};

export const getTripStatusLabel = (viaje: Viaje) => {
  const status = getEffectiveTripStatus(viaje);

  if (status === "disponible") return "Programado";
  if (status === "en curso") return "En curso";
  if (status === "completado") return "Completado";
  if (status === "cancelado") return "Cancelado";

  return "Programado";
};

export const formatTripDate = (fecha: string) => {
  const [year, month, day] = fecha.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTripTime = (hora: string) => {
  const [hours, minutes] = hora.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes || 0, 0, 0);

  return date.toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getTripScheduleLabel = (viaje: Viaje) => {
  const status = getEffectiveTripStatus(viaje);

  if (status === "en curso") {
    return `Viaje iniciado • Salida ${formatTripTime(viaje.hora_salida)}`;
  }

  if (status === "completado") {
    return `Completado • ${formatTripDate(viaje.fecha)} ${formatTripTime(
      viaje.hora_salida,
    )}`;
  }

  if (status === "cancelado") {
    return `Cancelado • ${formatTripDate(viaje.fecha)} ${formatTripTime(
      viaje.hora_salida,
    )}`;
  }

  return `Programado para ${formatTripDate(viaje.fecha)} a las ${formatTripTime(
    viaje.hora_salida,
  )}`;
};
