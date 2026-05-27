import { useAuthStore } from "@/store/authStore";
import { useViajesStore } from "@/store/realTripStore";
import { useSolicitudesStore } from "@/store/tripRequestStore";
import { getTripScheduleLabel } from "@/utils/tripDate";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronRight, Minus, Plus } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { usersMock } from "@/mock/users";

export default function TripDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const usuario = useAuthStore((state) => state.usuario);

  const viaje = useViajesStore((state) =>
    state.viajes.find((item) => String(item.id) === String(id)),
  );

  const crearSolicitud = useSolicitudesStore((state) => state.crearSolicitud);

  const solicitudes = useSolicitudesStore((state) => state.solicitudes);

  const solicitudExistente = useMemo(() => {
    if (!usuario || !viaje) return undefined;

    return solicitudes.find(
      (solicitud) =>
        solicitud.pasajero_id === usuario.id &&
        solicitud.viaje_id === viaje.id &&
        solicitud.estado !== "denegado",
    );
  }, [solicitudes, usuario?.id, viaje?.id]);

  const [asientos, setAsientos] = useState(1);
  const [mensaje, setMensaje] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);

  if (!viaje) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se encontró el viaje.</Text>
      </View>
    );
  }

  const conductor = usersMock.find(
    (usuario) => usuario.id === viaje.conductor_id,
  );

  const rating = 4.5;

  const handleOpenConductorProfile = () => {
    if (!conductor) return;

    if (conductor.id === usuario?.id) {
      router.push("/profile");
    } else {
      router.push(`/user/${conductor.id}`);
    }
  };

  const total = asientos * viaje.precio;
  const puedeReservar =
    viaje.estado_viaje === "disponible" && viaje.asientos_disponibles > 0;

  const aumentarAsientos = () => {
    if (asientos >= viaje.asientos_disponibles) {
      Alert.alert(
        "No hay suficientes asientos",
        `Solo hay ${viaje.asientos_disponibles} lugares disponibles.`,
      );
      return;
    }

    setAsientos((prev) => prev + 1);
  };

  const disminuirAsientos = () => {
    if (asientos <= 1) return;

    setAsientos((prev) => prev - 1);
  };

  const handleReservar = () => {
    if (viaje.estado_viaje !== "disponible") {
      Alert.alert(
        "Viaje no disponible",
        "Este viaje ya no está disponible para reservar.",
      );
      return;
    }

    if (!usuario) {
      Alert.alert("Error", "Debes iniciar sesión para reservar.");
      return;
    }

    if (usuario.rol !== 1) {
      Alert.alert(
        "No disponible",
        "Solo los pasajeros pueden reservar viajes.",
      );
      return;
    }

    if (asientos > viaje.asientos_disponibles) {
      Alert.alert(
        "No hay suficientes asientos",
        `Solo hay ${viaje.asientos_disponibles} lugares disponibles.`,
      );
      return;
    }

    if (solicitudExistente) {
      Alert.alert(
        "Solicitud existente",
        "Ya tienes una solicitud para este viaje.",
      );
      return;
    }

    crearSolicitud({
      viaje_id: viaje.id,
      pasajero_id: usuario.id,
      forma_pago: 1,
      asientos_reservados: asientos,
      total,
      mensaje: mensaje.trim() || undefined,
    });

    setMensaje("");

    Alert.alert(
      "Solicitud enviada",
      "Tu solicitud de reserva fue enviada al conductor.",
      [
        {
          text: "Aceptar",
          onPress: () => router.back(),
        },
      ],
    );
  };

  const getSolicitudText = () => {
    if (!solicitudExistente) return null;

    if (solicitudExistente.estado === "en espera") {
      return "Tu solicitud está en espera de aprobación.";
    }

    if (solicitudExistente.estado === "aprobado") {
      return "Tu solicitud fue aprobada. Este viaje ya está en tus viajes programados.";
    }

    return "Tu solicitud fue denegada.";
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Detalle del viaje</Text>

        <View style={styles.card}>
          {conductor && (
            <>
              <Text style={styles.label}>Conductor</Text>

              <TouchableOpacity
                style={styles.driverCard}
                onPress={handleOpenConductorProfile}
                activeOpacity={0.8}
              >
                <View style={styles.driverMain}>
                  {conductor.imagen_usuario ? (
                    <Image
                      source={{ uri: conductor.imagen_usuario }}
                      style={styles.driverAvatar}
                    />
                  ) : (
                    <View style={styles.driverAvatarFallback}>
                      <Text style={styles.driverAvatarInitial}>
                        {conductor.nombre.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>{conductor.nombre}</Text>

                    <View style={styles.driverRatingRow}>
                      <Text style={styles.driverStar}>★</Text>
                      <Text style={styles.driverRatingText}>{rating}</Text>
                      <Text style={styles.driverProfileText}>Ver perfil</Text>
                    </View>
                  </View>
                </View>

                <ChevronRight size={20} color="#6f8fa5" />
              </TouchableOpacity>

              <View style={styles.divider} />
            </>
          )}

          <Text style={styles.label}>Origen</Text>
          <Text style={styles.value}>{viaje.origen}</Text>

          <Text style={styles.label}>Destino</Text>
          <Text style={styles.value}>{viaje.destino}</Text>

          <Text style={styles.label}>Horario</Text>
          <Text style={styles.value}>{getTripScheduleLabel(viaje)}</Text>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text style={styles.labelNoMargin}>Precio por asiento</Text>
            <Text style={styles.price}>${viaje.precio}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.labelNoMargin}>Asientos disponibles</Text>
            <Text style={styles.valueSmall}>{viaje.asientos_disponibles}</Text>
          </View>
        </View>

        {!solicitudExistente && puedeReservar && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Reservar asientos</Text>

            <View style={styles.seatSelector}>
              <TouchableOpacity
                style={styles.seatButton}
                onPress={disminuirAsientos}
                activeOpacity={0.8}
              >
                <Minus size={18} color="#1a3a5c" />
              </TouchableOpacity>

              <Text style={styles.seatNumber}>{asientos}</Text>

              <TouchableOpacity
                style={styles.seatButton}
                onPress={aumentarAsientos}
                activeOpacity={0.8}
              >
                <Plus size={18} color="#1a3a5c" />
              </TouchableOpacity>
            </View>

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValue}>${total}</Text>
            </View>

            <Text style={styles.messageLabel}>Mensaje para el conductor</Text>

            <TextInput
              style={styles.messageInput}
              placeholder="Ej. Hola, ¿podrías recogerme cerca de la entrada principal?"
              placeholderTextColor="#7a9bb5"
              value={mensaje}
              onChangeText={setMensaje}
              multiline
              maxLength={180}
              textAlignVertical="top"
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />

            <Text style={styles.messageCounter}>{mensaje.length}/180</Text>
          </View>
        )}

        {solicitudExistente && (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{getSolicitudText()}</Text>
          </View>
        )}

        {(!solicitudExistente || solicitudExistente.estado === "denegado") && (
          <TouchableOpacity
            style={[styles.btnReservar, !puedeReservar && styles.btnDisabled]}
            onPress={handleReservar}
            disabled={!puedeReservar}
            activeOpacity={0.85}
          >
            <Text style={styles.btnReservarText}>
              {solicitudExistente?.estado === "denegado"
                ? "Enviar nueva solicitud"
                : "Reservar viaje"}
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: "#f4f8fb",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: "#1a3a5c",
    fontSize: 16,
    fontWeight: "700",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: "#6f8fa5",
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },

  labelNoMargin: {
    fontSize: 13,
    color: "#6f8fa5",
    fontWeight: "700",
  },

  value: {
    fontSize: 16,
    color: "#1a3a5c",
    fontWeight: "800",
  },

  valueSmall: {
    fontSize: 15,
    color: "#1a3a5c",
    fontWeight: "800",
  },

  price: {
    fontSize: 18,
    color: "#1a3a5c",
    fontWeight: "900",
  },

  divider: {
    height: 1,
    backgroundColor: "#e6eef5",
    marginVertical: 14,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 14,
  },

  seatSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginVertical: 8,
  },

  seatButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#dceef9",
    justifyContent: "center",
    alignItems: "center",
  },

  seatNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1a3a5c",
    minWidth: 36,
    textAlign: "center",
  },

  totalBox: {
    marginTop: 18,
    backgroundColor: "#dceef9",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    color: "#1a3a5c",
    fontSize: 14,
    fontWeight: "700",
  },

  totalValue: {
    color: "#1a3a5c",
    fontSize: 22,
    fontWeight: "900",
  },

  statusBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#d0e4f0",
  },

  statusText: {
    color: "#1a3a5c",
    fontWeight: "700",
    fontSize: 14,
  },

  btnReservar: {
    backgroundColor: "#1a3a5c",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 4,
  },

  btnDisabled: {
    backgroundColor: "#9db7ca",
  },

  btnReservarText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  driverCard: {
    backgroundColor: "#dceef9",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  driverMain: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  driverAvatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1a3a5c",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  driverAvatarInitial: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  driverInfo: {
    flex: 1,
  },

  driverName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 4,
  },

  driverRatingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  driverStar: {
    color: "#f2b705",
    fontSize: 14,
    marginRight: 4,
  },

  driverRatingText: {
    fontSize: 13,
    color: "#1a3a5c",
    fontWeight: "700",
    marginRight: 10,
  },

  driverProfileText: {
    fontSize: 12,
    color: "#6f8fa5",
    fontWeight: "700",
  },

  messageLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a3a5c",
    marginTop: 18,
    marginBottom: 6,
  },

  messageInput: {
    backgroundColor: "#dceef9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 86,
    fontSize: 14,
    color: "#1a3a5c",
  },

  messageCounter: {
    textAlign: "right",
    color: "#7a9bb5",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },

  bottomSpacer: {
    height: 16,
  },
});
