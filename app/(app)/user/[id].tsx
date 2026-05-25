import { reviewsMock } from "@/mock/reviews";
import { usersMock } from "@/mock/users";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BadgeAlert, BadgeCheck, ChevronLeft } from "lucide-react-native";
import { useMemo } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PublicProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const usuario = usersMock.find((u) => u.id === id);

    const resenas = useMemo(
        () => reviewsMock.filter((r) => r.conductor_id === id),
        [id]
    );

    const promedio = useMemo(() => {
        if (resenas.length === 0) return null;
        const total = resenas.reduce((acc, r) => acc + r.puntuacion, 0);
        return (total / resenas.length).toFixed(1);
    }, [resenas]);

    if (!usuario) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.noEncontrado}>
                    <Text style={styles.noEncontradoTexto}>Usuario no encontrado</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.volverTexto}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.btnVolver} onPress={() => router.back()}>
                <ChevronLeft size={24} color="#1a3a5c" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Image
                        source={require("@/assets/images/bgPP.jpg")}
                        style={styles.bgImage}
                        resizeMode="cover"
                    />
                    <View style={styles.bgOverlay} />

                    <View style={styles.avatarWrapper}>
                        {usuario.imagen_usuario ? (
                            <Image source={{ uri: usuario.imagen_usuario }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarInitial}>
                                    {usuario.nombre.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.nombreRow}>
                        <Text style={styles.nombre}>{usuario.nombre}</Text>
                        {usuario.verificado ? (
                            <BadgeCheck size={22} color="#1a3a5c" />
                        ) : (
                            <BadgeAlert size={22} color="#a0b4c8" />
                        )}
                    </View>
                    {promedio ? (
                        <View style={styles.ratingRow}>
                            <Text style={styles.estrella}>★</Text>
                            <Text style={styles.ratingTexto}>{promedio}</Text>
                        </View>
                    ) : (
                        <Text style={styles.sinCalificacion}>Sin calificaciones aún</Text>
                    )}

                    {usuario.descripcion ? (
                        <View style={styles.descripcionContainer}>
                            <Text style={styles.descripcionLabel}>Acerca de mi...</Text>
                            <Text style={styles.descripcion}>{usuario.descripcion}</Text>
                        </View>
                    ) : null}
                </View>

                <View style={styles.divider} />
                <View style={{ height: 32 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    btnVolver: {
        position: "absolute",
        top: 56,
        left: 16,
        zIndex: 10,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.85)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#1a3a5c",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    hero: {
        height: 220,
        position: "relative",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        width: "100%",
        height: "100%",
    },
    bgOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(200,225,245,0.25)",
    },
    avatarWrapper: {
        marginBottom: -52,
        zIndex: 1,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: "#fff",
    },
    avatarFallback: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#1a3a5c",
        borderWidth: 4,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarInitial: {
        fontSize: 42,
        fontWeight: "800",
        color: "#fff",
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginTop: 15,
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 24,
        alignItems: "center",
        shadowColor: "#1a3a5c",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 3,
    },
    nombreRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
        marginTop: 15
    },
    nombre: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1a3a5c",
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 16,
    },
    estrella: {
        fontSize: 22,
        color: "#1a3a5c",
    },
    ratingTexto: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a3a5c",
    },
    sinCalificacion: {
        fontSize: 13,
        color: "#a0b4c8",
        fontStyle: "italic",
        marginBottom: 16,
    },
    descripcionContainer: {
        alignItems: "center",
        gap: 6,
    },
    descripcionLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1a3a5c",
    },
    descripcion: {
        fontSize: 14,
        color: "#4a6a82",
        textAlign: "center",
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: "#dceef9",
        marginHorizontal: 16,
        marginVertical: 20,
    },
    noEncontrado: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    noEncontradoTexto: {
        fontSize: 16,
        color: "#1a3a5c",
        fontWeight: "700",
    },
    volverTexto: {
        fontSize: 14,
        color: "#4a90c4",
        fontWeight: "600",
    },
});