import { usersMock } from "@/mock/users";
import { useAuthStore } from "@/store/authStore";
import { useViajesStore } from "@/store/realTripStore";
import { useSolicitudesStore } from "@/store/tripRequestStore";
import { useChatStore } from "@/store/useChatStore";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TripRequestsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const viaje = useViajesStore((state) =>
    state.viajes.find((item) => String(item.id) === String(id)),
  );

  const usuario = useAuthStore((state) => state.usuario);

  const getOrCreateChat = useChatStore((state) => state.getOrCreateChat);

  const reducirAsientos = useViajesStore((state) => state.reducirAsientos);

  const solicitudesStore = useSolicitudesStore((state) => state.solicitudes);
  const solicitudes = useMemo(() => {
    return solicitudesStore.filter(
      (solicitud) => String(solicitud.viaje_id) === String(id),
    );
  }, [solicitudesStore, id]);

  const aprobarSolicitud = useSolicitudesStore(
    (state) => state.aprobarSolicitud,
  );

  const denegarSolicitud = useSolicitudesStore(
    (state) => state.denegarSolicitud,
  );

  if (!viaje) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No se encontró el viaje.</Text>
      </View>
    );
  }

  const getPasajero = (pasajeroId: string) => {
    return usersMock.find((usuario) => usuario.id === pasajeroId);
  };

  const handleAprobar = (solicitudId: string) => {
    const solicitud = solicitudes.find((item) => item.id === solicitudId);

    if (!solicitud) return;

    if (!usuario) {
      Alert.alert("Error", "No se encontró la sesión del conductor.");
      return;
    }

    if (solicitud.estado !== "en espera") {
      Alert.alert("Solicitud ya procesada", "Esta solicitud ya fue atendida.");
      return;
    }

    if (solicitud.asientos_reservados > viaje.asientos_disponibles) {
      Alert.alert(
        "No hay suficientes asientos",
        `El pasajero solicitó ${solicitud.asientos_reservados} asiento(s), pero solo quedan ${viaje.asientos_disponibles}.`,
      );
      return;
    }

    aprobarSolicitud(solicitud.id);
    reducirAsientos(viaje.id, solicitud.asientos_reservados);

    Alert.alert(
      "Solicitud aprobada",
      "El pasajero ya forma parte del viaje. ¿Deseas enviarle un mensaje?",
      [
        {
          text: "Ahora no",
          style: "cancel",
        },
        {
          text: "Ir al chat",
          onPress: () => {
            const chat = getOrCreateChat(
              usuario.id,
              solicitud.pasajero_id,
              viaje.id,
            );

            router.push({
              pathname: "/(app)/chats/[id]",
              params: {
                id: chat.id,
              },
            });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitudes del viaje</Text>

      <View style={styles.tripBox}>
        <Text style={styles.label}>Ruta</Text>
        <Text style={styles.routeText}>
          {viaje.origen} → {viaje.destino}
        </Text>

        <Text style={styles.label}>Asientos disponibles</Text>
        <Text style={styles.value}>{viaje.asientos_disponibles}</Text>
      </View>

      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Este viaje todavía no tiene solicitudes.
          </Text>
        }
        renderItem={({ item }) => {
          const pasajero = getPasajero(item.pasajero_id);

          return (
            <View style={styles.requestCard}>
              <Text style={styles.passengerName}>
                {pasajero?.nombre ?? "Pasajero desconocido"}
              </Text>

              <Text style={styles.infoText}>
                Asientos solicitados: {item.asientos_reservados}
              </Text>

              <Text style={styles.infoText}>Total: ${item.total}</Text>

              {item.mensaje && (
                <View style={styles.messageBox}>
                  <Text style={styles.messageTitle}>Mensaje del pasajero</Text>
                  <Text style={styles.messageText}>{item.mensaje}</Text>
                </View>
              )}

              <Text
                style={[
                  styles.status,
                  item.estado === "aprobado" && styles.statusApproved,
                  item.estado === "denegado" && styles.statusDenied,
                ]}
              >
                Estado: {item.estado}
              </Text>

              {item.estado === "en espera" && (
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={styles.btnReject}
                    onPress={() => denegarSolicitud(item.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnRejectText}>Rechazar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnApprove}
                    onPress={() => handleAprobar(item.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnApproveText}>Aprobar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={styles.btnBack}
        onPress={() => router.back()}
        activeOpacity={0.85}
      >
        <Text style={styles.btnBackText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f8fb",
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 16,
  },

  tripBox: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    color: "#6f8fa5",
    fontWeight: "700",
    marginBottom: 4,
  },

  routeText: {
    fontSize: 16,
    color: "#1a3a5c",
    fontWeight: "800",
    marginBottom: 12,
  },

  value: {
    fontSize: 18,
    color: "#1a3a5c",
    fontWeight: "900",
  },

  list: {
    paddingBottom: 20,
  },

  emptyText: {
    textAlign: "center",
    color: "#6f8fa5",
    fontWeight: "700",
    marginTop: 30,
  },

  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },

  passengerName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: "#1a3a5c",
    fontWeight: "600",
    marginBottom: 4,
  },

  status: {
    marginTop: 8,
    fontSize: 14,
    color: "#c28b00",
    fontWeight: "800",
  },

  statusApproved: {
    color: "#16803c",
  },

  statusDenied: {
    color: "#c0392b",
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  btnReject: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#c0392b",
    paddingVertical: 12,
    borderRadius: 28,
    alignItems: "center",
  },

  btnRejectText: {
    color: "#c0392b",
    fontWeight: "800",
  },

  btnApprove: {
    flex: 1,
    backgroundColor: "#1a3a5c",
    paddingVertical: 12,
    borderRadius: 28,
    alignItems: "center",
  },

  btnApproveText: {
    color: "#fff",
    fontWeight: "800",
  },

  btnBack: {
    backgroundColor: "#dceef9",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  btnBackText: {
    color: "#1a3a5c",
    fontWeight: "800",
    fontSize: 15,
  },
  messageBox: {
    backgroundColor: "#dceef9",
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },

  messageTitle: {
    fontSize: 12,
    color: "#6f8fa5",
    fontWeight: "800",
    marginBottom: 5,
  },

  messageText: {
    fontSize: 14,
    color: "#1a3a5c",
    fontWeight: "600",
    lineHeight: 20,
  },
});
