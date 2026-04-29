import { Vehiculo } from '@/types';
import { useEffect, useState } from 'react';
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
    vehiculo?: Vehiculo | null; // si viene es editar, si no es crear
    onClose: () => void;
    onGuardar: (vehiculo: Omit<Vehiculo, 'id' | 'usuario_id'>) => void;
}

const CAMPOS_VACIOS = {
    marca: '',
    modelo: '',
    color: '',
    placas: '',
    licencia: '',
};

export default function AddVehicleModal({ visible, vehiculo, onClose, onGuardar }: Props) {
    const [form, setForm] = useState(CAMPOS_VACIOS);

    useEffect(() => {
        if (vehiculo) {
            setForm({
                marca: vehiculo.marca,
                modelo: vehiculo.modelo,
                color: vehiculo.color,
                placas: vehiculo.placas,
                licencia: vehiculo.licencia,
            });
        } else {
            setForm(CAMPOS_VACIOS);
        }
    }, [vehiculo, visible]);

    const set = (key: keyof typeof CAMPOS_VACIOS) => (value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleGuardar = () => {
        if (!form.marca || !form.modelo || !form.color || !form.placas || !form.licencia) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }
        onGuardar({ ...form, imagen_vehiculo: undefined });
        onClose();
    };

    const esEdicion = !!vehiculo;

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
                            <Text style={styles.titulo}>
                                {esEdicion ? 'Editar vehículo' : 'Registrar vehículo'}
                            </Text>

                            <View style={styles.row}>
                                <View style={styles.rowItem}>
                                    <Text style={styles.label}>Marca</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.marca}
                                        onChangeText={set('marca')}
                                        placeholder="Toyota"
                                        placeholderTextColor="#a0b4c8"
                                        autoCapitalize="words"
                                    />
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.label}>Color</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.color}
                                        onChangeText={set('color')}
                                        placeholder="Blanco"
                                        placeholderTextColor="#a0b4c8"
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>Modelo</Text>
                            <TextInput
                                style={styles.input}
                                value={form.modelo}
                                onChangeText={set('modelo')}
                                placeholder="2024 Corolla Hybrid LE"
                                placeholderTextColor="#a0b4c8"
                                autoCapitalize="words"
                            />

                            <Text style={styles.label}>Placas</Text>
                            <TextInput
                                style={styles.input}
                                value={form.placas}
                                onChangeText={set('placas')}
                                placeholder="UTC-54-89"
                                placeholderTextColor="#a0b4c8"
                                autoCapitalize="characters"
                            />

                            <Text style={styles.label}>No. Licencia</Text>
                            <TextInput
                                style={styles.input}
                                value={form.licencia}
                                onChangeText={set('licencia')}
                                placeholder="Número de licencia"
                                placeholderTextColor="#a0b4c8"
                                autoCapitalize="characters"
                            />

                            <View style={styles.botones}>
                                <TouchableOpacity style={styles.btnCancelar} onPress={onClose} activeOpacity={0.8}>
                                    <Text style={styles.btnCancelarText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar} activeOpacity={0.85}>
                                    <Text style={styles.btnGuardarText}>
                                        {esEdicion ? 'Actualizar' : 'Registrar'}
                                    </Text>
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
        marginTop: 12,
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
        marginTop: 28,
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
    btnGuardar: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 30,
        backgroundColor: '#1a3a5c',
        alignItems: 'center',
    },
    btnGuardarText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});
