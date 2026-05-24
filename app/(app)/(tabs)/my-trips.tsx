import TripCard from "@/components/trips/tripCard";
import { usersMock } from "@/mock/users";
import { useAuthStore } from "@/store/authStore";
import { useViajesStore } from "@/store/realTripStore";

import { useSolicitudesStore } from "@/store/tripRequestStore";
import { Usuario, Viaje } from "@/types";
import { getEffectiveTripStatus, getTripScheduleLabel } from "@/utils/tripDate";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FiltroViaje = "disponible" | "en curso" | "completado" | "pendiente";

export default function MyTripsScreen() {
  const usuario = useAuthStore((state) => state.usuario);
  const viajes = useViajesStore((state) => state.viajes);
  const solicitudes = useSolicitudesStore((state) => state.solicitudes);

  const finalizarViaje = useViajesStore((state) => state.finalizarViaje);
  const sincronizarEstados = useViajesStore(
    (state) => state.sincronizarEstados,
  );
  const iniciarViaje = useViajesStore((state) => state.iniciarViaje);

  useEffect(() => {
    sincronizarEstados();
  }, []);

  const [filtro, setFiltro] = useState<FiltroViaje>("disponible");

  const viajesFiltrados = useMemo<Viaje[]>(() => {
    if (!usuario) return [];

    if (usuario.rol === 2) {
      return viajes.filter((viaje) => {
        const estado = getEffectiveTripStatus(viaje);

        return viaje.conductor_id === usuario.id && estado === filtro;
      });
    }

    if (usuario.rol === 1 && filtro === "pendiente") {
      const solicitudesPendientes = solicitudes.filter(
        (solicitud) =>
          solicitud.pasajero_id === usuario.id &&
          solicitud.estado === "en espera",
      );

      return solicitudesPendientes
        .map((solicitud) =>
          viajes.find((viaje) => viaje.id === solicitud.viaje_id),
        )
        .filter((viaje): viaje is Viaje => Boolean(viaje));
    }

    if (usuario.rol === 1) {
      const solicitudesAprobadas = solicitudes.filter(
        (solicitud) =>
          solicitud.pasajero_id === usuario.id &&
          solicitud.estado === "aprobado",
      );

      return solicitudesAprobadas
        .map((solicitud) =>
          viajes.find((viaje) => viaje.id === solicitud.viaje_id),
        )
        .filter((viaje): viaje is Viaje => Boolean(viaje))
        .filter((viaje) => {
          const estado = getEffectiveTripStatus(viaje);
          return estado === filtro;
        });
    }

    return [];
  }, [usuario?.id, usuario?.rol, viajes, solicitudes, filtro]);

  const handleIniciarViaje = (viaje: Viaje) => {
    iniciarViaje(viaje.id);

    router.push({
      pathname: "/(app)/trips/[id]",
      params: {
        id: String(viaje.id),
      },
    });
  };

  const handleContinuarViaje = (viaje: Viaje) => {
    router.push({
      pathname: "/(app)/trips/[id]",
      params: {
        id: String(viaje.id),
      },
    });
  };

  const getConductor = (conductorId: string): Usuario | undefined => {
    return usersMock.find((usuario) => usuario.id === conductorId);
  };
  const tabs =
    usuario?.rol === 1
      ? [
          { label: "Pendientes", value: "pendiente" as const },
          { label: "Programados", value: "disponible" as const },
          { label: "En curso", value: "en curso" as const },
          { label: "Completados", value: "completado" as const },
        ]
      : [
          { label: "Programados", value: "disponible" as const },
          { label: "En curso", value: "en curso" as const },
          { label: "Completados", value: "completado" as const },
        ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis viajes</Text>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, filtro === tab.value && styles.tabActive]}
            onPress={() => setFiltro(tab.value)}
          >
            <Text
              style={[
                styles.tabText,
                filtro === tab.value && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={viajesFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tienes viajes en esta sección.
          </Text>
        }
        renderItem={({ item }) => {
          const conductor = getConductor(item.conductor_id);

          if (!conductor) return null;

          return (
            <View style={styles.cardWrapper}>
              <TripCard
                viaje={item}
                conductor={conductor}
                onPress={() => {
                  if (usuario?.rol === 2) {
                    router.push({
                      pathname: "/trips/tripsRequest",
                      params: {
                        id: String(item.id),
                      },
                    });
                    return;
                  }

                  router.push({
                    pathname: "/trips/tripDetail",
                    params: {
                      id: String(item.id),
                    },
                  });
                }}
              />

              <Text style={styles.scheduleText}>
                {getTripScheduleLabel(item)}
              </Text>

              {usuario?.rol === 2 && item.estado_viaje === "disponible" && (
                <>
                  <TouchableOpacity
                    style={styles.btnSolicitudes}
                    onPress={() => {
                      router.push({
                        pathname: "/trips/tripsRequest",
                        params: {
                          id: String(item.id),
                        },
                      });
                    }}
                  >
                    <Text style={styles.btnSolicitudesText}>
                      Ver solicitudes
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnIniciar}
                    onPress={() => handleIniciarViaje(item)}
                  >
                    <Text style={styles.btnIniciarText}>Iniciar viaje</Text>
                  </TouchableOpacity>
                </>
              )}

              {usuario?.rol === 2 && item.estado_viaje === "en curso" && (
                <TouchableOpacity
                  style={styles.btnIniciar}
                  onPress={() => handleContinuarViaje(item)}
                >
                  <Text style={styles.btnIniciarText}>Continuar viaje</Text>
                </TouchableOpacity>
              )}

              {usuario?.rol === 1 && filtro === "pendiente" && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    Tu solicitud está en espera de aprobación.
                  </Text>
                </View>
              )}

              {usuario?.rol === 1 && filtro === "disponible" && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    Tu solicitud fue aprobada. Este viaje está programado.
                  </Text>
                </View>
              )}

              {usuario?.rol === 1 && filtro === "en curso" && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>Tu viaje está en curso.</Text>
                </View>
              )}

              {usuario?.rol === 1 && filtro === "completado" && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    Este viaje fue completado.
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f8fb",
    padding: 16,
  },

  scheduleText: {
    marginTop: 8,
    color: "#1a3a5c",
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 16,
  },

  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    backgroundColor: "#dceef9",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: "#1a3a5c",
  },

  tabText: {
    color: "#1a3a5c",
    fontWeight: "700",
    fontSize: 12,
  },

  tabTextActive: {
    color: "#fff",
  },

  list: {
    paddingBottom: 30,
  },

  cardWrapper: {
    marginBottom: 16,
  },

  btnIniciar: {
    marginTop: 10,
    backgroundColor: "#1a3a5c",
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: "center",
  },

  btnIniciarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  btnContinuar: {
    marginTop: 10,
    backgroundColor: "#dceef9",
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1a3a5c",
  },

  btnContinuarText: {
    color: "#1a3a5c",
    fontWeight: "700",
    fontSize: 15,
  },

  emptyText: {
    textAlign: "center",
    color: "#6f8fa5",
    marginTop: 40,
    fontWeight: "600",
  },

  btnSolicitudes: {
    marginTop: 10,
    backgroundColor: "#dceef9",
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1a3a5c",
  },

  btnSolicitudesText: {
    color: "#1a3a5c",
    fontWeight: "800",
    fontSize: 15,
  },

  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#d0e4f0",
  },

  infoText: {
    color: "#1a3a5c",
    fontWeight: "700",
    fontSize: 13,
  },
});
