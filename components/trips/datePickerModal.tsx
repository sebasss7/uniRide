import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    visible: boolean;
    mode: "date" | "time";
    value: Date;
    onChange: (date: Date) => void;
    onClose: () => void;
}

export default function DatePickerModal({
    visible,
    mode,
    value,
    onChange,
    onClose,
}: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.titulo}>
                        {mode === "date" ? "Seleccionar fecha" : "Seleccionar hora"}
                    </Text>

                    <DateTimePicker
                        value={value}
                        mode={mode}
                        display="spinner"
                        minimumDate={mode === "date" ? new Date() : undefined}
                        locale="es-MX"
                        onChange={(_, selectedDate) => {
                            if (selectedDate) onChange(selectedDate);
                        }}
                    />

                    <TouchableOpacity style={styles.btnListo} onPress={onClose} activeOpacity={0.85}>
                        <Text style={styles.btnListoText}>Listo</Text>
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
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        width: "85%",
        alignItems: "center",
        shadowColor: "#1a3a5c",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    titulo: {
        fontSize: 16,
        fontWeight: "800",
        color: "#1a3a5c",
        marginBottom: 8,
        alignSelf: "flex-start",
    },
    btnListo: {
        marginTop: 12,
        backgroundColor: "#1a3a5c",
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 30,
        width: "100%",
        alignItems: "center",
    },
    btnListoText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#fff",
    },
});
