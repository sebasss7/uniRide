// app/my-trips.tsx

import TripCard from "@/components/trips/tripCard";
import { useAuthStore } from "@/store/authStore";
import { useViajesStore } from "@/store/realTripStore";
import { Viaje } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type FiltroViaje = "disponible" | "en curso" | "completado" | "cancelado";

export default function MyTripsScreen() {
  const usuario = useAuthStore((state) => state.usuario);
  const viajes = useViajesStore((state) => state.viajes);
  const updateViajeEstado = useViajesStore((state) => state.updateViajeEstado);

  const [filtro, setFiltro] = useState<FiltroViaje>("disponible");

  const misViajes = viajes.filter(
    (viaje) =>
      viaje.conductor_id === usuario?.id && viaje.estado_viaje === filtro,
  );

  const handleIniciarViaje = (viaje: Viaje) => {
    updateViajeEstado(viaje.id, "en curso");

    router.push({
      pathname: "/(app)/trips/[id]",
      params: {
        id: viaje.id,
      },
    });
  };
  const handleContinuarViaje = (viaje: Viaje) => {
    router.push({
      pathname: "/(app)/trips/[id]",
      params: {
        id: viaje.id,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis viajes</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, filtro === "disponible" && styles.tabActive]}
          onPress={() => setFiltro("disponible")}
        >
          <Text
            style={[
              styles.tabText,
              filtro === "disponible" && styles.tabTextActive,
            ]}
          >
            Programados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filtro === "en curso" && styles.tabActive]}
          onPress={() => setFiltro("en curso")}
        >
          <Text
            style={[
              styles.tabText,
              filtro === "en curso" && styles.tabTextActive,
            ]}
          >
            En curso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filtro === "completado" && styles.tabActive]}
          onPress={() => setFiltro("completado")}
        >
          <Text
            style={[
              styles.tabText,
              filtro === "completado" && styles.tabTextActive,
            ]}
          >
            Completados
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={misViajes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes viajes aquí todavía.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TripCard
              viaje={item}
              conductor={usuario!}
              onPress={() => {
                console.log("Ver viaje", item.id);
              }}
            />

            {item.estado_viaje === "disponible" && (
              <TouchableOpacity
                style={styles.btnIniciar}
                onPress={() => handleIniciarViaje(item)}
                activeOpacity={0.85}
              >
                <Text style={styles.btnIniciarText}>Iniciar viaje</Text>
              </TouchableOpacity>
            )}

            {item.estado_viaje === "en curso" && (
              <TouchableOpacity
                style={styles.btnContinuar}
                onPress={() => handleContinuarViaje(item)}
                activeOpacity={0.85}
              >
                <Text style={styles.btnContinuarText}>Continuar viaje</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
});
