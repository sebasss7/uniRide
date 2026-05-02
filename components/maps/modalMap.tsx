import { router } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;

  origen: string;
  destino: string;

  setSelecting: (type: "origen" | "destino" | null) => void;
}

export default function TripModal({
  visible,
  onClose,
  origen,
  destino,
  setSelecting,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (!visible) return null;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, collapsed && styles.collapsed]}>
        <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
          <Text style={styles.toggle}>
            {collapsed ? "Expandir ▲" : "Minimizar ▼"}
          </Text>
        </TouchableOpacity>

        {!collapsed && (
          <>
            <Text style={styles.title}>Nuevo viaje</Text>

            <Pressable
              onPress={() => {
                setSelecting("origen");
                setCollapsed(true);
              }}
            >
              <View style={styles.input}>
                <TextInput
                  placeholder="Punto de partida"
                  value={origen}
                  editable={false}
                  pointerEvents="none"
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                setSelecting("destino");
                setCollapsed(true);
              }}
            >
              <View style={styles.input}>
                <TextInput
                  placeholder="Punto de destino"
                  value={destino}
                  editable={false}
                  pointerEvents="none"
                />
              </View>
            </Pressable>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                router.replace("/home");
              }}
            >
              <Text style={styles.btnText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: "box-none",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "55%",
    pointerEvents: "auto",
  },
  collapsed: {
    height: 100,
  },
  toggle: {
    textAlign: "center",
    marginBottom: 10,
    color: "#1a3a5c",
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a3a5c",
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#1a3a5c",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  close: {
    textAlign: "center",
    marginTop: 10,
    color: "red",
  },
});
