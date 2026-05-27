import DatePickerModal from "@/components/trips/datePickerModal";
import PostTripModal from "@/components/trips/postTripModal";
import TripCard from "@/components/trips/tripCard";
import { usersMock } from "@/mock/users";
import { vehiclesMock } from "@/mock/vehicles";
import { useAuthStore } from "@/store/authStore";
import { useViajesStore } from "@/store/realTripStore";
import { useTripStore } from "@/store/tripStore";
import { Viaje } from "@/types";
import { Place } from "@/types/place";
import { router } from "expo-router";
import {
  AlarmClock,
  Calendar1,
  MapPinHouse,
  MapPinSearch,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Coordinate {
  latitude: number;
  longitude: number;
}

const toRad = (value: number) => (value * Math.PI) / 180;

const getDistanceInMeters = (pointA: Coordinate, pointB: Coordinate) => {
  const earthRadius = 6371000;

  const latitudeDistance = toRad(pointB.latitude - pointA.latitude);
  const longitudeDistance = toRad(pointB.longitude - pointA.longitude);

  const latitudeA = toRad(pointA.latitude);
  const latitudeB = toRad(pointB.latitude);

  const result =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(latitudeA) *
    Math.cos(latitudeB) *
    Math.sin(longitudeDistance / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(result), Math.sqrt(1 - result));
};

export default function homeScreen() {
  const usuario = useAuthStore((state) => state.usuario);

  const tieneVehiculos = vehiclesMock.some((v) => v.usuario_id === usuario?.id);

  const [modalVisible, setModalVisible] = useState(false);

  const { origen, destino, clearTrip } = useTripStore();

  const realtrips = useViajesStore((state) => state.viajes);
  const addTrip = useViajesStore((state) => state.addViaje);

  const RADIO_BUSQUEDA_METROS = 10000;

  const [busquedaAplicada, setBusquedaAplicada] =
    useState<FiltrosBusqueda | null>(null);

  const viajesDisponibles = useMemo(() => {
    return realtrips.filter((viaje) => {
      return viaje.estado_viaje === "disponible";
    });
  }, [realtrips]);

  const viajesMostrados = useMemo(() => {
    if (!busquedaAplicada) {
      return viajesDisponibles;
    }

    return viajesDisponibles.filter((viaje) => {
      const coincideOrigen =
        !busquedaAplicada.origen ||
        getDistanceInMeters(busquedaAplicada.origen, viaje.origenCoords) <=
        RADIO_BUSQUEDA_METROS;

      const coincideDestino =
        !busquedaAplicada.destino ||
        getDistanceInMeters(busquedaAplicada.destino, viaje.destinoCoords) <=
        RADIO_BUSQUEDA_METROS;

      const coincideFecha =
        !busquedaAplicada.fecha || viaje.fecha === busquedaAplicada.fecha;

      const coincideHora =
        !busquedaAplicada.hora || viaje.hora_salida === busquedaAplicada.hora;

      return coincideOrigen && coincideDestino && coincideFecha && coincideHora;
    });
  }, [viajesDisponibles, busquedaAplicada]);

  // date picker
  const [fecha, setFecha] = useState<Date | null>(null);
  const [hora, setHora] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatFecha = (date: Date) => {
    return date.toISOString().split("T")[0]; // yyyy-mm-dd
  };

  const formatHora = (date: Date) => {
    return date.toTimeString().slice(0, 5); // HH:mm
  };
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);

  const handleBuscar = () => {
    if (!origen && !destino && !fecha && !hora) {
      Alert.alert(
        "Sin filtros",
        "Selecciona al menos un origen, destino, fecha u hora para buscar.",
      );
      return;
    }

    setBusquedaAplicada({
      origen,
      destino,
      fecha: fecha ? formatFecha(fecha) : null,
      hora: hora ? formatHora(hora) : null,
    });

    setFiltrosAplicados(true);
  };

  const vehiculoActual = vehiclesMock.find(
    (vehiculo) => vehiculo.usuario_id === usuario?.id,
  );

  const handleLimpiar = () => {
    clearTrip();

    setFecha(null);
    setHora(null);

    setShowDatePicker(false);
    setShowTimePicker(false);

    setBusquedaAplicada(null);
    setFiltrosAplicados(false);
  };

  const handlePublicarViaje = (viajeData: Omit<Viaje, "id">) => {
    const nuevoViaje: Viaje = {
      id: Date.now().toString(),
      ...viajeData,
    };

    addTrip(nuevoViaje);

    Alert.alert(
      "Viaje publicado",
      "Tu viaje fue creado correctamente y ya aparece en tus viajes programados.",
    );
  };

  const getConductor = (conductor_id: string) =>
    usersMock.find((u) => u.id === conductor_id) ?? usersMock[0];

  interface FiltrosBusqueda {
    origen: Place | null;
    destino: Place | null;
    fecha: string | null;
    hora: string | null;
  }

  const getTimePickerValue = () => {
    const base = fecha ? new Date(fecha) : new Date();

    if (hora) {
      base.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
    }

    return base;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={viajesMostrados}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.searchSection}>
              <View style={styles.searchHeader}>
                <Text style={styles.searchTitle}>Buscar</Text>

                {tieneVehiculos && (
                  <TouchableOpacity
                    style={styles.btnPublicar}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnPublicarText}>Publicar viaje +</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Pressable onPress={() => router.push("/map")}>
                <View style={styles.inputWrapper}>
                  <MapPinHouse size={16} color="#1a3a5c" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Punto de partida"
                    placeholderTextColor="#7a9bb5"
                    value={origen?.address || ""}
                    editable={false}
                    pointerEvents="none"
                  />
                </View>
              </Pressable>

              <View style={styles.inputWrapper}>
                <MapPinSearch size={16} color="#1a3a5c" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Punto de destino"
                  placeholderTextColor="#7a9bb5"
                  value={destino?.address || ""}
                />
              </View>

              <View style={styles.row}>
                <Pressable
                  style={[styles.inputWrapper, styles.rowItem]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar1 size={16} color="#1a3a5c" />
                  <Text
                    style={[styles.searchInput, !fecha && { color: "#7a9bb5" }]}
                  >
                    {fecha ? formatFecha(fecha) : "Fecha"}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.inputWrapper, styles.rowItem]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <AlarmClock size={16} color="#1a3a5c" />
                  <Text
                    style={[styles.searchInput, !hora && { color: "#7a9bb5" }]}
                  >
                    {hora ? formatHora(hora) : "Hora"}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.btnListo}
                  onPress={handleBuscar}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnListoText}>Listo</Text>
                </TouchableOpacity>
                {filtrosAplicados && (
                  <TouchableOpacity
                    style={styles.btnLimpiar}
                    onPress={handleLimpiar}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnLimpiarText}>Limpiar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.separator} />
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No se encontraron viajes con estos filtros.
          </Text>
        }
        renderItem={({ item }) => {
          const conductor = getConductor(item.conductor_id);

          if (!conductor) return null;

          return (
            <TripCard
              viaje={item}
              conductor={conductor}
              onPress={() => {
                router.push({
                  pathname: "/trips/tripDetail",
                  params: {
                    id: item.id,
                  },
                });
              }}
            />
          );
        }}
      />

      <PostTripModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        vehiculoId={vehiculoActual?.id ?? null}
        onPublicar={handlePublicarViaje}
      />

      <DatePickerModal
        visible={showDatePicker}
        mode="date"
        value={fecha || new Date()}
        onChange={(selectedDate) => {
          setFecha(selectedDate);
          setHora(null);
        }}
        onClose={() => setShowDatePicker(false)}
      />

      <DatePickerModal
        visible={showTimePicker}
        mode="time"
        value={getTimePickerValue()}
        selectedDate={fecha}
        onChange={(selectedDate) => {
          setHora(selectedDate);
        }}
        onClose={() => setShowTimePicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7fc",
  },
  listContent: {
    paddingBottom: 24,
  },
  searchSection: {
    backgroundColor: "#dceef9",
    padding: 16,
    gap: 10,
  },
  searchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  searchTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a3a5c",
  },
  btnPublicar: {
    backgroundColor: "#1a3a5c",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  btnPublicarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eaf4fb",
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1a3a5c",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  rowItem: {
    flex: 1,
  },
  btnListo: {
    flex: 1,
    backgroundColor: "#1a3a5c",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnListoText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  btnLimpiar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#1a3a5c",
    alignItems: "center",
    justifyContent: "center",
  },
  btnLimpiarText: {
    color: "#1a3a5c",
    fontWeight: "700",
    fontSize: 15,
  },
  separator: {
    height: 16,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a3a5c",
  },
  emptySubtext: {
    fontSize: 13,
    color: "#7a9bb5",
  },
});
