import * as DocumentPicker from "expo-document-picker";
import { BadgeCheck } from "lucide-react-native";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
    visible: boolean;
    onClose: () => void;
    onVerificado: () => void;
}

export default function VerifyProfileModal({
    visible,
    onClose,
    onVerificado,
}: Props) {
    const handleSubirDocumento = async () => {
        try {
            const resultado = await DocumentPicker.getDocumentAsync({
                type: ["image/*", "application/pdf"],
                copyToCacheDirectory: false,
            });

            if (resultado.canceled) return;

            onVerificado();
            onClose();

            Alert.alert(
                "Tu cuenta ha sido verificada exitosamente"
            );
        } catch {
            Alert.alert("No se pudo procesar el documento, intenta de nuevo");
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <BadgeCheck size={36} color="#1a3a5c" />
                    </View>

                    <Text style={styles.titulo}>Verificar cuenta</Text>
                    <Text style={styles.descripcion}>
                        Sube una credencial o constancia para verificar que
                        perteneces a la universidad.
                    </Text>

                    <View style={styles.formatosContainer}>
                        <Text style={styles.formatosLabel}>Formatos aceptados</Text>
                        <Text style={styles.formatos}>PDF, JPG, PNG</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.btnSubir}
                        onPress={handleSubirDocumento}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnSubirText}>Seleccionar documento</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnCancelar}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.btnCancelarText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 28,
        width: "100%",
        alignItems: "center",
        shadowColor: "#1a3a5c",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#dceef9",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    icon: {
        fontSize: 36,
    },
    titulo: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1a3a5c",
        marginBottom: 10,
        textAlign: "center",
    },
    descripcion: {
        fontSize: 14,
        color: "#4a6a82",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 20,
    },
    formatosContainer: {
        backgroundColor: "#f0f7fc",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 24,
        alignItems: "center",
        width: "100%",
    },
    formatosLabel: {
        fontSize: 11,
        color: "#7a9bb5",
        fontWeight: "600",
        marginBottom: 2,
    },
    formatos: {
        fontSize: 13,
        color: "#1a3a5c",
        fontWeight: "700",
    },
    btnSubir: {
        backgroundColor: "#1a3a5c",
        borderRadius: 30,
        paddingVertical: 14,
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    btnSubirText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
    btnCancelar: {
        paddingVertical: 12,
        width: "100%",
        alignItems: "center",
    },
    btnCancelarText: {
        color: "#7a9bb5",
        fontWeight: "600",
        fontSize: 14,
    },
});
