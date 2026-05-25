import { usersMock } from "@/mock/users";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Tab = "login" | "signup";

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [nombre, setNombre] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    const usuario = usersMock.find(
      (u) => u.correo === loginEmail && u.password === loginPassword,
    );
    if (!usuario) {
      Alert.alert("Error", "Correo o contraseña incorrectos");
      return;
    }
    login(usuario);
    router.replace("/home");
  };

  const handleSignup = () => {
    if (!nombre || !signupEmail || !telefono || !signupPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    const nombreReg = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!nombreReg.test(nombre.trim())) {
      Alert.alert(
        "Nombre inválido",
      );
      return;
    }

    if (!signupEmail.toLowerCase().endsWith("@alumnos.uaq.mx")) {
      Alert.alert(
        "Debes usar tu correo institucional",
      );
      return;
    }

    if (signupPassword.length < 8) {
      Alert.alert(
        "La contraseña debe tener al menos 8 caracteres",
      );
      return;
    }

    //Simulación de registro creando un usuario temporal
    const nuevoUsuario = {
      id: String(Date.now()),
      rol: 1 as const,
      nombre,
      correo: signupEmail,
      password: signupPassword,
      telefono,
      nacimiento: "",
      descripcion: "",
      verificado: false,
      imagen_usuario: undefined,
    };
    login(nuevoUsuario);
    router.replace("/home");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bg.jpeg")}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/logoUniR.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>UniRide</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "login" && styles.tabActive]}
                onPress={() => setActiveTab("login")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "login" && styles.tabTextActive,
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "signup" && styles.tabActive]}
                onPress={() => setActiveTab("signup")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "signup" && styles.tabTextActive,
                  ]}
                >
                  Signup
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === "login" && (
              <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="nombre@alumnos.uaq.mx"
                  placeholderTextColor="#a0b4c8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="contraseña"
                  placeholderTextColor="#a0b4c8"
                  secureTextEntry
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  activeOpacity={0.85}
                >
                  <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === "signup" && (
              <View style={styles.form}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Juan Pérez Correa"
                  placeholderTextColor="#a0b4c8"
                  autoCapitalize="words"
                  value={nombre}
                  onChangeText={setNombre}
                />

                <View style={styles.row}>
                  <View style={styles.rowItem}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ejemplo@alumnos.uaq.mx"
                      placeholderTextColor="#a0b4c8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={signupEmail}
                      onChangeText={setSignupEmail}
                    />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="442 849 3309"
                      placeholderTextColor="#a0b4c8"
                      keyboardType="phone-pad"
                      value={telefono}
                      onChangeText={setTelefono}
                    />
                  </View>
                </View>

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="contraseña"
                  placeholderTextColor="#a0b4c8"
                  secureTextEntry
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSignup}
                  activeOpacity={0.85}
                >
                  <Text style={styles.buttonText}>Registrarme</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text style={styles.footer}>
            Aplicación exclusiva para universitarios
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    height: 250,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1a3a5c",
    letterSpacing: -1,
    marginTop: -50,
  },
  logo: {
    width: 250,
    height: 250,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#1a3a5c",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#eaf2fb",
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#1a3a5c",
    shadowColor: "#1a3a5c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7a9bb5",
  },
  tabTextActive: {
    color: "#ffffff",
  },
  form: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a3a5c",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#dceef9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1a3a5c",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  button: {
    backgroundColor: "#1a3a5c",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#1a3a5c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  footer: {
    marginTop: 28,
    fontSize: 13,
    color: "#3a6080",
    textAlign: "center",
    fontWeight: "500",
  },
});
