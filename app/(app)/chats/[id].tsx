import { chatsMock } from "@/mock/chats";
import { mensajesMock } from "@/mock/messages";
import { usersMock } from "@/mock/users";
import { useAuthStore } from '@/store/authStore';
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ArrowLeft,
    Ban,
    MoreVertical,
    Send
} from "lucide-react-native";
import { useEffect } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ChatPrivateScreen() {
    //Id del chat que se seleccionó en la pantalla anterior (mensajes)
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { usuario } = useAuthStore();
    const myId = usuario?.id;

    //Buscar chat actual
    const chat = chatsMock.find(c => c.id === id);

    //Buscar al otro usuario
    const otroUsuarioId = chat?.participantes.find(p => p !== myId);
    const otroUsuario = usersMock.find(u => u.id === otroUsuarioId);

    //Filtrar mensajes que pertenecen al chat
    const mensajesChat = mensajesMock.filter(m => m.chat_id === id);

    //Renderizar burbujas
    const renderMensaje = ({ item }: { item: any }) => {
        const yo = item.id_emisor === myId;

        return (
            <View style={[styles.mensajeFila, yo ? styles.posicionDerecha : styles.posicionIzquierda]}>
                <View style={[styles.burbuja, yo ? styles.burbujaPropia : styles.burbujaAjena]}>
                    <Text style={styles.textoMensaje}>{item.contenido}</Text>
                    <Text style={styles.horaMensaje}>{item.hora}</Text>
                </View>
            </View>
        );
    };

    //Marcar como "leído" para quitar la burbujita azul
    useEffect(() => {
        let actualizado = false;

        mensajesChat.forEach(mensaje => {
            if (mensaje.id_emisor !== myId && !mensaje.leido) {
                mensaje.leido = true;
                actualizado = true;
            }
        });
    }, [id]);

    //Mostrar error por si no se encuentra el chat
    if (!otroUsuario) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Error: chat no encontrado!</Text>
            </SafeAreaView>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView style={styles.inner}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.iconButton}
                        accessibilityLabel="Regresar a la lista de chats"
                        accessibilityRole="button"
                    >
                        <ArrowLeft size={24} color="#000000" />
                    </TouchableOpacity>

                    <View style={styles.userInfoContainer}>
                        {otroUsuario.imagen_usuario ? (
                            <Image source={{ uri: otroUsuario.imagen_usuario }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarInitial}>
                                    {otroUsuario.nombre.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}

                        <View style={styles.textContainer}>
                            <Text style={styles.nombreText}>{otroUsuario.nombre}</Text>
                        </View>
                    </View>

                    <View style={styles.actionsContainer}>
                        {/* TouchableOpacity con accesibilidad */}
                        <TouchableOpacity
                            style={styles.iconButton}
                            accessibilityLabel="Bloquear usuario"
                            accessibilityRole="button"
                        >
                            <Ban size={22} color="#000000" />
                        </TouchableOpacity>

                        {/* TouchableOpacity con accesibilidad */}
                        <TouchableOpacity
                            style={styles.iconButton}
                            accessibilityLabel="Más opciones"
                            accessibilityRole="button"
                        >
                            <MoreVertical size={24} color="#000000" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.divider} />

                <View style={styles.messagesContainer}>
                    <FlatList
                        data={mensajesChat}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMensaje}
                        contentContainerStyle={styles.listaMensajes}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Escribe un mensaje"
                        placeholderTextColor="#7a9bb5"
                    />

                    {/* TouchableOpacity con accesibilidad */}
                    <TouchableOpacity
                        style={styles.sendButton}
                        accessibilityLabel="Enviar mensaje"
                        accessibilityRole="button"
                    >
                        <Send size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inner: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 12
    },
    iconButton: {
        padding: 8
    },
    userInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    avatarFallback: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1a3a5c',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    textContainer: {
        paddingLeft: 12
    },
    nombreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    divider: {
        height: 1,
        backgroundColor: '#dceef9',
        width: '100%'
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    listaMensajes: {
        padding: 16,
        gap: 12
    },
    mensajeFila: {
        width: '100%',
        flexDirection: 'row',
    },
    posicionDerecha: {
        justifyContent: 'flex-end',
    },
    posicionIzquierda: {
        justifyContent: 'flex-start',
    },
    burbuja: {
        maxWidth: '80%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
    },
    burbujaPropia: {
        backgroundColor: '#b8d4e8',
        borderBottomRightRadius: 4,
    },
    burbujaAjena: {
        backgroundColor: '#e6e6e6',
        borderBottomLeftRadius: 4,
    },
    textoMensaje: {
        fontSize: 15,
        color: '#1a3a5c',
        lineHeight: 20,
    },
    horaMensaje: {
        fontSize: 11,
        color: '#7a9bb5',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#dceef9',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#eaf4fb',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1a3a5c',
    },
    sendButton: {
        marginLeft: 12,
        padding: 8,
    }
});