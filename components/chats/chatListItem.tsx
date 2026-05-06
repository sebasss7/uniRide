import { Chat, Mensaje, Usuario } from '@/types';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

//Definir los datos que necesita la tarjeta
interface Props {
    chat: Chat;
    otroUsuario: Usuario;
    ultimoMensaje?: Mensaje;
    onPress: () => void;
}

export default function ChatListItem({ chat, otroUsuario, ultimoMensaje, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.chatContainer} onPress={onPress} activeOpacity={0.85}>

            <View>
                {otroUsuario.imagen_usuario ? (
                    <Image source={{ uri: otroUsuario.imagen_usuario }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarFallback}>
                        <Text style={styles.avatarInitial}>
                            {otroUsuario.nombre.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.nombreText}>{otroUsuario.nombre}</Text>
                <Text style={styles.mensajeText} numberOfLines={1}>
                    {/* Si existe un mensaje, poner el contenido. Si no, poner algo por defecto */}
                    {ultimoMensaje ? ultimoMensaje.contenido : 'Aún no hay mensajes!'}
                </Text>
            </View>

            {ultimoMensaje && !ultimoMensaje.leido && (
                <View style={styles.unreadDot} />
            )}

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 12
    },
    textContainer: {
        flex: 1
    },
    nombreText: {
        color: '#1A3A5C',
        fontWeight: 'bold'
    },
    mensajeText: {
        color: '#b4b6b7ff'
    },
    unreadDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4a90c4',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    avatarFallback: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1a3a5c',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    }
});