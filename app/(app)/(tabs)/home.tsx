import DatePickerModal from "@/components/trips/datePickerModal";
import PostTripModal from "@/components/trips/postTripModal";
import TripCard from "@/components/trips/tripCard";
import { tripsMock } from "@/mock/trips";
import { usersMock } from "@/mock/users";
import { useTripStore } from "@/store/tripStore";
import { Viaje } from "@/types";
import { router } from "expo-router";
import {
  AlarmClock,
  Calendar1,
  MapPinHouse,
  MapPinSearch,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function homeScreen() {
  const [viajes, setViajes] = useState<Viaje[]>(tripsMock);
  const [modalVisible, setModalVisible] = useState(false);
  const { origen, destino } = useTripStore();

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

  const [filtrOrigen, setFiltroOrigen] = useState("");
  const [filtroDestino, setFiltroDestino] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroHora, setFiltroHora] = useState("");
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);

  const viajesFiltrados = useMemo(() => {
    if (!filtrosAplicados)
      return viajes.filter((v) => v.estado_viaje === "disponible");

    return viajes.filter((v) => {
      const matchOrigen = filtrOrigen
        ? v.origen.toLowerCase().includes(filtrOrigen.toLowerCase())
        : true;
      const matchDestino = filtroDestino
        ? v.destino.toLowerCase().includes(filtroDestino.toLowerCase())
        : true;
      const matchFecha = filtroFecha ? v.fecha === filtroFecha : true;
      const matchHora = filtroHora ? v.hora_salida === filtroHora : true;
      return (
        matchOrigen &&
        matchDestino &&
        matchFecha &&
        matchHora &&
        v.estado_viaje === "disponible"
      );
    });
  }, [
    viajes,
    filtrosAplicados,
    filtrOrigen,
    filtroDestino,
    filtroFecha,
    filtroHora,
  ]);

  const handleBuscar = () => {
    setFiltrosAplicados(true);
  };

  const handleLimpiar = () => {
    setFiltroOrigen("");
    setFiltroDestino("");
    setFiltroFecha("");
    setFiltroHora("");
    setFiltrosAplicados(false);
  };

  const handlePublicar = (nuevoViaje: Omit<Viaje, "id">) => {
    const viaje: Viaje = {
      ...nuevoViaje,
      id: String(Date.now()),
    };
    setViajes((prev) => [viaje, ...prev]);
  };

  const getConductor = (conductor_id: string) =>
    usersMock.find((u) => u.id === conductor_id) ?? usersMock[0];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={viajesFiltrados}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.searchSection}>
              <View style={styles.searchHeader}>
                <Text style={styles.searchTitle}>Buscar</Text>
                <TouchableOpacity
                  style={styles.btnPublicar}
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnPublicarText}>Publicar viaje +</Text>
                </TouchableOpacity>
              </View>

              <Pressable onPress={() => router.push("/map")}>
                <View style={styles.inputWrapper}>
                  <MapPinHouse size={16} color="#1a3a5c" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Punto de partida"
                    placeholderTextColor="#7a9bb5"
                    value={origen}
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
                  value={destino}
                  onChangeText={setFiltroDestino}
                />
              </View>

              <View style={styles.row}>
                <Pressable
                  style={[styles.inputWrapper, styles.rowItem]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar1 size={16} color="#1a3a5c" />
                  <Text
                    style={[
                      styles.searchInput,
                      !fecha && { color: "#7a9bb5" }
                    ]}
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
                    style={[
                      styles.searchInput,
                      !hora && { color: "#7a9bb5" }
                    ]}
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
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🚙</Text>
            <Text style={styles.emptyText}>No hay viajes disponibles</Text>
            <Text style={styles.emptySubtext}>Intenta con otros filtros</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TripCard
            viaje={item}
            conductor={getConductor(item.conductor_id)}
            onPress={() => {
              console.log("Ver viaje", item.id);
            }}
          />
        )}
      />

      <PostTripModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPublicar={handlePublicar}
      />

      <DatePickerModal
        visible={showDatePicker}
        mode="date"
        value={fecha || new Date()}
        onChange={(selectedDate) => {
          setFecha(selectedDate);
          setFiltroFecha(formatFecha(selectedDate));
        }}
        onClose={() => setShowDatePicker(false)}
      />

      <DatePickerModal
        visible={showTimePicker}
        mode="time"
        value={hora || new Date()}
        onChange={(selectedDate) => {
          const now = new Date();

          if (fecha) {
            const mismaFecha =
              fecha.toDateString() === now.toDateString();

            if (mismaFecha && selectedDate < now) {
              return;
            }
          }

          setHora(selectedDate);
          setFiltroHora(formatHora(selectedDate));
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
