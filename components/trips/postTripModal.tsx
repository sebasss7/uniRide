import { getPlaceLabel } from "@/services/googleMaps";
import { useAuthStore } from "@/store/authStore";
import { Viaje } from "@/types";
import { Place } from "@/types/place";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PlaceInput from "../maps/placeInput";
import DatePickerModal from "./datePickerModal";

interface Props {
  visible: boolean;
  onClose: () => void;
  vehiculoId: string | null;
  onPublicar: (viaje: Omit<Viaje, "id">) => void;
}
export default function PostTripModal({
  visible,
  onClose,
  onPublicar,
  vehiculoId,
}: Props) {
  const usuario = useAuthStore((state) => state.usuario);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [asientos, setAsientos] = useState("");
  const [precio, setPrecio] = useState("");
  const [origenText, setOrigenText] = useState("");

  const [destinoText, setDestinoText] = useState("");
  const [origenPlace, setOrigenPlace] = useState<Place | null>(null);
  const [destinoPlace, setDestinoPlace] = useState<Place | null>(null);

  useEffect(() => {
    setFecha(format(selectedDate, "yyyy-MM-dd"));

    setHora(
      format(selectedDate, "HH:mm", {
        locale: es,
      })
    );
  }, [selectedDate]);

  const handlePublicar = () => {
    if (!usuario) {
      Alert.alert("Error", "Debes iniciar sesión para publicar un viaje.");
      return;
    }

    if (usuario.rol !== 2) {
      Alert.alert("Error", "Solo un conductor puede publicar viajes.");
      return;
    }

    if (!vehiculoId) {
      Alert.alert(
        "Vehículo requerido",
        "Debes tener un vehículo registrado para publicar un viaje.",
      );
      return;
    }

    if (
      !origenPlace ||
      !destinoPlace ||
      !fecha ||
      !hora ||
      !asientos ||
      !precio
    ) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    const asientosNumber = Number(asientos);
    const precioNumber = Number(precio);

    if (!Number.isInteger(asientosNumber) || asientosNumber <= 0) {
      Alert.alert("Error", "Ingresa una cantidad válida de asientos.");
      return;
    }

    if (Number.isNaN(precioNumber) || precioNumber <= 0) {
      Alert.alert("Error", "Ingresa un precio válido.");
      return;
    }

    const fechaHoraViaje = new Date(`${fecha}T${hora}:00`);

    if (Number.isNaN(fechaHoraViaje.getTime())) {
      Alert.alert(
        "Fecha u hora inválida",
        "Usa el formato de fecha YYYY-MM-DD y hora HH:mm.",
      );
      return;
    }

    if (fechaHoraViaje.getTime() <= new Date().getTime()) {
      Alert.alert(
        "Fecha inválida",
        "El viaje debe programarse para una fecha y hora futura.",
      );
      return;
    }

    onPublicar({
      conductor_id: usuario.id,
      vehiculo_id: vehiculoId,
      estado_viaje: "disponible",

      origen: getPlaceLabel(origenPlace),
      destino: getPlaceLabel(destinoPlace),

      origenCoords: {
        latitude: origenPlace.latitude,
        longitude: origenPlace.longitude,
      },

      destinoCoords: {
        latitude: destinoPlace.latitude,
        longitude: destinoPlace.longitude,
      },

      fecha,
      hora_salida: hora,
      asientos_disponibles: asientosNumber,
      precio: precioNumber,
    });

    setOrigenText("");
    setDestinoText("");
    setOrigenPlace(null);
    setDestinoPlace(null);
    setFecha("");
    setHora("");
    setAsientos("");
    setPrecio("");

    onClose();
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.titulo}>Publicar viaje</Text>

              <PlaceInput
                label="Punto de partida"
                placeholder="Ej. Facultad de Informática"
                value={origenText}
                onChangeText={(text) => {
                  setOrigenText(text);
                  setOrigenPlace(null);
                }}
                onSelectPlace={(place) => {
                  setOrigenPlace(place);
                  setOrigenText(getPlaceLabel(place));
                }}
              />

              <PlaceInput
                label="Punto de destino"
                placeholder="Ej. Rectoría UAQ"
                value={destinoText}
                onChangeText={(text) => {
                  setDestinoText(text);
                  setDestinoPlace(null);
                }}
                onSelectPlace={(place) => {
                  setDestinoPlace(place);
                  setDestinoText(getPlaceLabel(place));
                }}
              />

              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Fecha</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={{ color: fecha ? "#000" : "#a0b4c8" }}>
                      {fecha || "Seleccionar fecha"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Hora salida</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={{ color: hora ? "#000" : "#a0b4c8" }}>
                      {hora || "Seleccionar hora"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Asientos</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="3"
                    placeholderTextColor="#a0b4c8"
                    keyboardType="numeric"
                    value={asientos}
                    onChangeText={setAsientos}
                  />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Precio ($)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="30"
                    placeholderTextColor="#a0b4c8"
                    keyboardType="numeric"
                    value={precio}
                    onChangeText={setPrecio}
                  />
                </View>
              </View>

              <View style={styles.botones}>
                <TouchableOpacity
                  style={styles.btnCancelar}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnCancelarText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnPublicar}
                  onPress={handlePublicar}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnPublicarText}>Publicar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>

      <DatePickerModal
        visible={showDatePicker}
        mode="date"
        value={selectedDate}
        onChange={(date) => {
          const updated = new Date(selectedDate);

          updated.setFullYear(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );

          setSelectedDate(updated);
        }}
        onClose={() => setShowDatePicker(false)}
      />

      <DatePickerModal
        visible={showTimePicker}
        mode="time"
        value={selectedDate}
        onChange={(date) => {
          const updated = new Date(selectedDate);

          updated.setHours(date.getHours());
          updated.setMinutes(date.getMinutes());

          setSelectedDate(updated);
        }}
        onClose={() => setShowTimePicker(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "90%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#d0e4f0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a3a5c",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#dceef9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1a3a5c",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  botones: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  btnCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#1a3a5c",
    alignItems: "center",
  },
  btnCancelarText: {
    color: "#1a3a5c",
    fontWeight: "700",
    fontSize: 15,
  },
  btnPublicar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "#1a3a5c",
    alignItems: "center",
  },
  btnPublicarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
