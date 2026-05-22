import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
    const [tempDate, setTempDate] = useState(value);

    useEffect(() => {
        if (visible) {
            setTempDate(value);
        }
    }, [visible, value]);

    const isValidDateTime = (date: Date) => {
        const now = new Date();

        if (mode === "date") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const selected = new Date(date);
            selected.setHours(0, 0, 0, 0);

            return selected >= today;
        }

        if (mode === "time") {
            const isToday =
                date.toDateString() === now.toDateString();

            if (!isToday) return true;

            const selectedMinutes =
                date.getHours() * 60 + date.getMinutes();

            const currentMinutes =
                now.getHours() * 60 + now.getMinutes();

            return selectedMinutes >= currentMinutes;
        }

        return true;
    };

    // android nativo
    if (Platform.OS === "android") {
        if (!visible) return null;

        return (
            <DateTimePicker
                value={tempDate}
                mode={mode}
                display={mode === "date" ? "calendar" : "clock"}
                minimumDate={mode === "date" ? new Date() : undefined}
                onChange={(event, selectedDate) => {
                    if (event.type !== "set" || !selectedDate) {
                        onClose();
                        return;
                    }

                    if (!isValidDateTime(selectedDate)) {
                        Alert.alert(
                            "Fecha u hora inválida",
                            "No puedes seleccionar un valor pasado"
                        );
                        onClose();
                        return;
                    }

                    setTempDate(selectedDate);
                    onChange(selectedDate);
                    onClose();
                }}
            />
        );
    }

    //modal para ios
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.titulo}>
                        {mode === "date"
                            ? "Seleccionar fecha"
                            : "Seleccionar hora"}
                    </Text>

                    <DateTimePicker
                        value={tempDate}
                        mode={mode}
                        display="spinner"
                        locale="es-MX"
                        minimumDate={mode === "date" ? new Date() : undefined}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) {
                                setTempDate(selectedDate);
                            }
                        }}
                    />

                    <TouchableOpacity
                        style={styles.btnListo}
                        onPress={() => {
                            if (!isValidDateTime(tempDate)) {
                                Alert.alert(
                                    "Hora inválida",
                                    "No puedes seleccionar un valor pasado"
                                );
                                return;
                            }

                            onChange(tempDate);
                            onClose();
                        }}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnListoText}>
                            Listo
                        </Text>
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
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    btnListo: {
        marginTop: 12,
        backgroundColor: "#1a3a5c",
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