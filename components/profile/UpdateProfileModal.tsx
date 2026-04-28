import { Usuario } from '@/types';
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
    usuario: Usuario;
    onClose: () => void;
    onGuardar: (datos: Partial<Usuario>) => void;
}

export default function UpdateProfileModal({ visible, usuario, onClose, onGuardar }: Props) {
    const [nombre, setNombre] = useState(usuario.nombre);
    const [descripcion, setDescripcion] = useState(usuario.descripcion ?? '');
    const [telefono, setTelefono] = useState(usuario.telefono);
    const [nacimiento, setNacimiento] = useState(usuario.nacimiento);

    useEffect(() => {
        setNombre(usuario.nombre);
        setDescripcion(usuario.descripcion ?? '');
        setTelefono(usuario.telefono);
        setNacimiento(usuario.nacimiento);
    }, [usuario]);

    const handleGuardar = () => {
        if (!nombre.trim()) {
            Alert.alert('Error', 'El nombre no puede estar vacío');
            return;
        }
        onGuardar({ nombre, descripcion, telefono, nacimiento });
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
                            <Text style={styles.titulo}>Editar información</Text>

                            <Text style={styles.label}>Nombre completo</Text>
                            <TextInput
                                style={styles.input}
                                value={nombre}
                                onChangeText={setNombre}
                                autoCapitalize="words"
                                placeholder="Tu nombre"
                                placeholderTextColor="#a0b4c8"
                            />

                            <Text style={styles.label}>Descripción</Text>
                            <TextInput
                                style={[styles.input, styles.inputMultiline]}
                                value={descripcion}
                                onChangeText={setDescripcion}
                                multiline
                                numberOfLines={3}
                                placeholder="Cuéntanos algo sobre ti..."
                                placeholderTextColor="#a0b4c8"
                            />

                            <Text style={styles.label}>Teléfono</Text>
                            <TextInput
                                style={styles.input}
                                value={telefono}
                                onChangeText={setTelefono}
                                keyboardType="phone-pad"
                                placeholder="+52 442 000 0000"
                                placeholderTextColor="#a0b4c8"
                            />

                            <Text style={styles.label}>Fecha de nacimiento</Text>
                            <TextInput
                                style={styles.input}
                                value={nacimiento}
                                onChangeText={setNacimiento}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#a0b4c8"
                            />

                            <View style={styles.botones}>
                                <TouchableOpacity style={styles.btnCancelar} onPress={onClose} activeOpacity={0.8}>
                                    <Text style={styles.btnCancelarText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar} activeOpacity={0.85}>
                                    <Text style={styles.btnGuardarText}>Guardar</Text>
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
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
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
