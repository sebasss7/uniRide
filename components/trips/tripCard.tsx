import { Usuario, Viaje } from '@/types';
import { Bus } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    viaje: Viaje;
    conductor: Usuario;
    onPress: () => void;
}

export default function TripCard({ viaje, conductor, onPress }: Props) {
    const rating = 4.5;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <View style={styles.header}>
                <View style={styles.conductorInfo}>
                    {conductor.imagen_usuario ? (
                        <Image source={{ uri: conductor.imagen_usuario }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarFallback}>
                            <Text style={styles.avatarInitial}>
                                {conductor.nombre.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View>
                        <Text style={styles.conductorNombre}>{conductor.nombre}</Text>
                        <View style={styles.ratingRow}>
                            <Text style={styles.star}>★</Text>
                            <Text style={styles.ratingText}>{rating}</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.precio}>${viaje.precio}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.ruta}>
                <View style={styles.horas}>
                    <Text style={styles.hora}>{viaje.hora_salida}</Text>
                    <Text style={styles.aprox}>Aprox</Text>
                    <Text style={styles.hora}>
                        {calcularHoraLlegada(viaje.hora_salida, 20)}
                    </Text>
                </View>

                <View style={styles.lineaContainer}>
                    <Bus size={16} color="#1a3a5c" />
                    <View style={styles.lineaVertical} />
                    <Bus size={16} color="#1a3a5c" />
                </View>

                <View style={styles.lugares}>
                    <View>
                        <Text style={styles.lugarTexto} numberOfLines={1}>
                            {viaje.origen}
                        </Text>
                        <Text style={styles.asientosTexto}>
                            {viaje.asientos_disponibles} lugares disponibles
                        </Text>
                    </View>
                    <View style={styles.destinoContainer}>
                        <Text style={styles.lugarTexto} numberOfLines={1}>
                            {viaje.destino}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function calcularHoraLlegada(horaSalida: string, minutosExtra: number): string {
    const [h, m] = horaSalida.split(':').map(Number);
    const total = h * 60 + m + minutosExtra;
    const hh = Math.floor(total / 60) % 24;
    const mm = total % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#eaf2fb',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#1a3a5c',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    conductorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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
    },
    conductorNombre: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a3a5c',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 2,
    },
    star: {
        color: '#f4a94e',
        fontSize: 13,
    },
    ratingText: {
        fontSize: 13,
        color: '#1a3a5c',
        fontWeight: '500',
    },
    precio: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1a3a5c',
    },

    divider: {
        height: 1,
        backgroundColor: '#b8d4e8',
        marginBottom: 14,
    },
    ruta: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    horas: {
        alignItems: 'flex-end',
        gap: 4,
        paddingTop: 2,
    },
    hora: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1a3a5c',
    },
    aprox: {
        fontSize: 11,
        color: '#7a9bb5',
        fontStyle: 'italic',
        marginVertical: 4,
    },
    lineaContainer: {
        alignItems: 'center',
        gap: 2,
    },
    lineaVertical: {
        width: 2,
        height: 32,
        backgroundColor: '#1a3a5c',
        borderRadius: 1,
    },
    lugares: {
        flex: 1,
        justifyContent: 'space-between',
        gap: 12,
    },
    lugarTexto: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a3a5c',
    },
    asientosTexto: {
        fontSize: 12,
        color: '#4a90c4',
        fontWeight: '500',
        marginTop: 2,
    },
    destinoContainer: {
        marginTop: 8,
    },
});
