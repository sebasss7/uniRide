import { Resena } from "@/types";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    resena: Resena;
}

function Estrellas({ puntuacion }: { puntuacion: number }) {
    return (
        <View style={styles.estrellasRow}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Text key={i} style={[styles.estrella, i <= puntuacion && styles.estrellaActiva]}>
                    ★
                </Text>
            ))}
        </View>
    );
}

export default function ReviewCard({ resena }: Props) {
    return (
        <View style={styles.card}>
            <Estrellas puntuacion={resena.puntuacion} />
            <Text style={styles.comentario}>"{resena.comentario}"</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#dceef9",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
        alignItems: "center",
        gap: 10,
    },
    estrellasRow: {
        flexDirection: "row",
        gap: 4,
    },
    estrella: {
        fontSize: 22,
        color: "#b8d4e8",
    },
    estrellaActiva: {
        color: "#1a3a5c",
    },
    comentario: {
        fontSize: 14,
        color: "#1a3a5c",
        fontStyle: "italic",
        textAlign: "center",
        lineHeight: 22,
    },
});