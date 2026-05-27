import { Viaje } from "@/types";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  viaje: Viaje | null;
  conductorNombre?: string;
  onClose: () => void;
  onEnviar: (puntuacion: number, comentario: string) => void;
}

export default function ReviewModal({
  visible,
  viaje,
  conductorNombre,
  onClose,
  onEnviar,
}: Props) {
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    if (visible) {
      setPuntuacion(0);
      setComentario("");
    }
  }, [visible]);

  const handleEnviar = () => {
    if (puntuacion === 0) {
      Alert.alert("Calificación requerida", "Selecciona de 1 a 5 estrellas.");
      return;
    }

    if (comentario.trim().length < 5) {
      Alert.alert(
        "Comentario requerido",
        "Escribe un comentario breve sobre tu experiencia.",
      );
      return;
    }

    onEnviar(puntuacion, comentario.trim());
  };

  if (!viaje) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>Calificar viaje</Text>

          <Text style={styles.subtitle}>
            ¿Cómo fue tu experiencia con {conductorNombre ?? "el conductor"}?
          </Text>

          <View style={styles.routeBox}>
            <Text style={styles.routeText}>{viaje.origen}</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.routeText}>{viaje.destino}</Text>
          </View>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setPuntuacion(star)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.star,
                    star <= puntuacion && styles.starSelected,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingLabel}>
            {puntuacion === 0
              ? "Selecciona una calificación"
              : `${puntuacion} de 5 estrellas`}
          </Text>

          <TextInput
            style={styles.commentInput}
            placeholder="Comparte tu experiencia durante el viaje..."
            placeholderTextColor="#7a9bb5"
            value={comentario}
            onChangeText={setComentario}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSend}
              onPress={handleEnviar}
              activeOpacity={0.85}
            >
              <Text style={styles.btnSendText}>Enviar reseña</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#d0e4f0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#6f8fa5",
    fontWeight: "600",
    marginBottom: 16,
  },

  routeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dceef9",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },

  routeText: {
    flex: 1,
    color: "#1a3a5c",
    fontSize: 13,
    fontWeight: "700",
  },

  arrow: {
    color: "#1a3a5c",
    fontSize: 18,
    fontWeight: "800",
    marginHorizontal: 8,
  },

  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },

  star: {
    fontSize: 38,
    color: "#d0e4f0",
  },

  starSelected: {
    color: "#f2b705",
  },

  ratingLabel: {
    textAlign: "center",
    color: "#6f8fa5",
    fontWeight: "700",
    marginBottom: 18,
  },

  commentInput: {
    backgroundColor: "#dceef9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#1a3a5c",
    minHeight: 100,
    fontSize: 14,
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },

  btnCancel: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#1a3a5c",
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: "center",
  },

  btnCancelText: {
    color: "#1a3a5c",
    fontWeight: "800",
  },

  btnSend: {
    flex: 1,
    backgroundColor: "#1a3a5c",
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: "center",
  },

  btnSendText: {
    color: "#fff",
    fontWeight: "800",
  },
});
