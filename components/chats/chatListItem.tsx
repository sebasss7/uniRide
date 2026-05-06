import { Chat, Mensaje, Usuario } from '@/types';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

//Definir los datos que necesita la tarjeta
interface Props {
    chat: Chat;
    otroUsuario: Usuario; //Con quién se tiene la conversación
    ultimoMensaje: Mensaje;
    onPress: () => void;
}

export default function ChatListItem({ chat, otroUsuario, ultimoMensaje, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.chatContainer} onPress={onPress} activeOpacity={0.85}>

            {/* Contenedor de la imagen */}
            <View>
                {/* Aquí va la lógica de la imagen (puedes copiar la validación de avatar de tripCard) */}
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

            {/* Contenedor de texto para Nombre y extracto del mensaje */}
            <View style={styles.textContainer}>
                <Text style={styles.nombreText}>{otroUsuario.nombre}</Text>
                <Text style={styles.mensajeText} numberOfLines={1}>
                    {ultimoMensaje.contenido}
                </Text>
            </View>

            {/* Contenedor con punto azul que se muestra sólo si NO se ha leído */}
            {!ultimoMensaje.leido && (
                <View style={styles.unreadDot} />
            )}

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        // Tu misión: usar Flexbox aquí. Necesitas que la imagen, los textos y el punto estén en FILA.
        // Investiga flexDirection, alignItems y padding.
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 12
    },
    textContainer: {
        // Este contenedor ocupa el espacio sobrante. Investiga la propiedad "flex: 1".
        flex: 1
    },
    nombreText: {
        // Ponle el color azul marino que usan tus compas: '#1a3a5c' y hazlo negrita.
        color: '#1A3A5C',
        fontWeight: 'bold'
    },
    mensajeText: {
        // Ponle un gris discreto.
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