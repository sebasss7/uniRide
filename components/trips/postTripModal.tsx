import { useAuthStore } from '@/store/authStore';
import { Viaje } from '@/types';
import { useState } from 'react';
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
} from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    onPublicar: (viaje: Omit<Viaje, 'id'>) => void;
}

export default function PostTripModal({ visible, onClose, onPublicar }: Props) {
    const usuario = useAuthStore((state) => state.usuario);

    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [asientos, setAsientos] = useState('');
    const [precio, setPrecio] = useState('');

    const handlePublicar = () => {
        if (!origen || !destino || !fecha || !hora || !asientos || !precio) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        onPublicar({
            conductor_id: usuario?.id ?? '',
            vehiculo_id: '1',
            estado_viaje: 'disponible',
            origen,
            destino,
            fecha,
            hora_salida: hora,
            asientos_disponibles: Number(asientos),
            precio: Number(precio),
        });

        setOrigen('');
        setDestino('');
        setFecha('');
        setHora('');
        setAsientos('');
        setPrecio('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.sheet}>
                        <View style={styles.handle} />

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.titulo}>Publicar viaje</Text>

                            <Text style={styles.label}>Punto de partida</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej. Facultad de Informática"
                                placeholderTextColor="#a0b4c8"
                                value={origen}
                                onChangeText={setOrigen}
                            />

                            <Text style={styles.label}>Punto de destino</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej. Facultad de Contaduría"
                                placeholderTextColor="#a0b4c8"
                                value={destino}
                                onChangeText={setDestino}
                            />

                            <View style={styles.row}>
                                <View style={styles.rowItem}>
                                    <Text style={styles.label}>Fecha</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="2026-04-27"
                                        placeholderTextColor="#a0b4c8"
                                        value={fecha}
                                        onChangeText={setFecha}
                                    />
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.label}>Hora salida</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="12:00"
                                        placeholderTextColor="#a0b4c8"
                                        value={hora}
                                        onChangeText={setHora}
                                    />
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
                                <TouchableOpacity style={styles.btnCancelar} onPress={onClose} activeOpacity={0.8}>
                                    <Text style={styles.btnCancelarText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnPublicar} onPress={handlePublicar} activeOpacity={0.85}>
                                    <Text style={styles.btnPublicarText}>Publicar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    keyboardView: {
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: 40,
        maxHeight: '90%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#d0e4f0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    titulo: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1a3a5c',
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1a3a5c',
        marginBottom: 6,
        marginTop: 8,
    },
    input: {
        backgroundColor: '#dceef9',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1a3a5c',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    rowItem: {
        flex: 1,
    },
    botones: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    btnCancelar: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#1a3a5c',
        alignItems: 'center',
    },
    btnCancelarText: {
        color: '#1a3a5c',
        fontWeight: '700',
        fontSize: 15,
    },
    btnPublicar: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 30,
        backgroundColor: '#1a3a5c',
        alignItems: 'center',
    },
    btnPublicarText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});
