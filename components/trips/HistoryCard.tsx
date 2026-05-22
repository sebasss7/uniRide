import { Viaje } from '@/types';
import { Calendar, MapPin } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    viaje: Viaje;
}

export default function HistoryCard({ viaje }: Props) {
    const cancelado = viaje.estado_viaje === 'cancelado';

    return (
        <View style={styles.cardContainer}>
            <View style={styles.topRow}>
                <View style={styles.dateContainer}>
                    <Calendar size={14} color="#7a9bb5" />
                    <Text style={styles.dateText}>{viaje.fecha} • {viaje.hora_salida}</Text>
                </View>

                {/* <Text style={[styles.statusText, cancelado ? styles.statusCancelado : styles.statusCompletado]}>
                    {viaje.estado_viaje}
                </Text> */}

                <Text style={styles.precioText}>${viaje.precio}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.routeContainer}>
                <View style={styles.iconContainer}>
                    <MapPin size={18} color="#1a3a5c" />
                </View>
                <View style={styles.locations}>
                    <Text style={styles.lugarTexto} numberOfLines={1}>
                        {viaje.origen}
                    </Text>
                    <Text style={styles.destinoTexto} numberOfLines={1}>
                        a {viaje.destino}
                    </Text>
                </View>
            </View>

            <View style={styles.bottomRow}>
                {/* <Text style={styles.precioText}>${viaje.precio}</Text> */}
                <Text style={styles.statusText}>
                    {viaje.estado_viaje}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
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
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#7a9bb5',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
        color: "#7a9bb5"
    },
    divider: {
        height: 1,
        backgroundColor: '#b8d4e8',
        marginBottom: 14,
    },
    routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
    },
    locations: {
        flex: 1,
        gap: 4,
    },
    lugarTexto: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1a3a5c',
    },
    destinoTexto: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a3a5c',
    },
    bottomRow: {
        marginTop: 8,
        flexDirection: 'row-reverse',
        alignItems: 'baseline',
    },
    precioText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1a3a5c',
    },
});