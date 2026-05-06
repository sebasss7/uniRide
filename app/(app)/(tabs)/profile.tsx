import AddVehicleModal from '@/components/profile/AddVehicleModal';
import UpdateProfileModal from '@/components/profile/UpdateProfileModal';
import { vehiclesMock } from '@/mock/vehicles';
import { useAuthStore } from '@/store/authStore';
import { Vehiculo } from '@/types';
import { Pencil, PlusCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PerfilScreen() {
    const { usuario, login } = useAuthStore();
    const [modalEditarVisible, setModalEditarVisible] = useState(false);

    const [vehiculos, setVehiculos] = useState<Vehiculo[]>(() => vehiclesMock);

    const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
    const [vehiculoEditando, setVehiculoEditando] = useState<Vehiculo | null>(null);

    const vehiculosUsuario = vehiculos.filter(
        (v) => v.usuario_id === usuario?.id
    );

    useEffect(() => {
        if (usuario?.id) {
            setVehiculos(vehiclesMock);
        }
    }, [usuario?.id]);

    if (!usuario) return null;

    const calcularEdad = (nacimiento: string): number => {
        if (!nacimiento) return 0;
        const hoy = new Date();
        const nac = new Date(nacimiento);
        let edad = hoy.getFullYear() - nac.getFullYear();
        const mes = hoy.getMonth() - nac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
        return edad;
    };

    const handleGuardarPerfil = (datos: Partial<typeof usuario>) => {
        login({ ...usuario, ...datos });
    };

    const handleAbrirVehiculo = (vehiculo?: Vehiculo) => {
        setVehiculoEditando(vehiculo ?? null);
        setModalVehiculoVisible(true);
    };

    const handleGuardarVehiculo = (datos: Omit<Vehiculo, 'id' | 'usuario_id'>) => {
        if (vehiculoEditando) {
            setVehiculos((prev) =>
                prev.map((v) =>
                    v.id === vehiculoEditando.id
                        ? { ...v, ...datos }
                        : v
                )
            );
        } else {
            const nuevoVehiculo: Vehiculo = {
                id: Date.now().toString(),
                usuario_id: usuario?.id ?? "",
                ...datos
            };

            setVehiculos((prev) => [...prev, nuevoVehiculo]);
        }
    };

    const edad = calcularEdad(usuario.nacimiento);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <Image
                        source={require('@/assets/images/bgPP.jpg')}
                        style={styles.bgImage}
                        resizeMode="cover"
                    />

                    <View style={styles.bgOverlay} />

                    <View style={styles.avatarWrapper}>
                        {usuario.imagen_usuario ? (
                            <Image source={{ uri: usuario.imagen_usuario }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarInitial}>
                                    {usuario.nombre.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <View style={styles.verificadoBadge}>
                            <Text style={styles.verificadoIcon}>🛡️</Text>
                        </View>
                    </View>

                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.btnEditar}
                            onPress={() => setModalEditarVisible(true)}
                        >
                            <Text style={styles.btnEditarText}>Editar información</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.nombre}>{usuario.nombre}</Text>
                    {usuario.descripcion ? (
                        <Text style={styles.descripcion}>{usuario.descripcion}</Text>
                    ) : (
                        <Text style={styles.descripcionVacia}>Sin descripción aún</Text>
                    )}
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información personal</Text>

                    {edad > 0 && (
                        <Text style={styles.infoItem}>{edad} años</Text>
                    )}
                    <Text style={styles.infoItem}>{usuario.correo}</Text>
                    <Text style={styles.infoItem}>+52 {usuario.telefono}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.vehiculosHeader}
                        onPress={() => handleAbrirVehiculo()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.sectionTitle}>Vehículos</Text>
                        <PlusCircle style={styles.addIcon} size={20} color="#1a3a5c" />
                    </TouchableOpacity>

                    {vehiculosUsuario.length === 0 ? (
                        <Text style={styles.sinVehiculos}>No tienes vehículos registrados</Text>
                    ) : (
                        vehiculosUsuario.map((v) => (
                            <View key={v.id} style={styles.vehiculoCard}>
                                <View style={styles.vehiculoInfo}>
                                    <Text style={styles.vehiculoMarca}>{v.marca}</Text>
                                    <Text style={styles.vehiculoModelo}>{v.modelo}</Text>
                                    <Text style={styles.vehiculoPlacas}>{v.placas}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleAbrirVehiculo(v)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Pencil size={16} color="#1a3a5c" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 32 }} />
            </ScrollView>
            <UpdateProfileModal
                visible={modalEditarVisible}
                usuario={usuario}
                onClose={() => setModalEditarVisible(false)}
                onGuardar={handleGuardarPerfil}
            />

            <AddVehicleModal
                visible={modalVehiculoVisible}
                vehiculo={vehiculoEditando}
                onClose={() => setModalVehiculoVisible(false)}
                onGuardar={handleGuardarVehiculo}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        height: 200,
        position: 'relative',
    },
    headerContent: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    bgOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(200,225,245,0.3)',
    },
    avatarWrapper: {
        position: 'absolute',
        bottom: -30,
        left: 20,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: '#fff',
    },
    avatarFallback: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#1a3a5c',
        borderWidth: 4,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
    },
    verificadoBadge: {
        position: 'absolute',
        bottom: 0,
        right: -2,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    verificadoIcon: {
        fontSize: 16,
    },
    btnEditar: {
        alignSelf: 'flex-end',
        backgroundColor: '#1a3a5c',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    btnEditarText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    nombre: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1a3a5c',
        marginTop: 36,
        marginBottom: 6,
    },
    descripcion: {
        fontSize: 14,
        color: '#4a6a82',
        lineHeight: 20,
    },
    descripcionVacia: {
        fontSize: 14,
        color: '#a0b4c8',
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: '#dceef9',
        marginHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1a3a5c',
        marginBottom: 12,
    },
    infoItem: {
        fontSize: 14,
        color: '#3a5a72',
        marginBottom: 6,
        lineHeight: 22,
    },
    vehiculosHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addIcon: {
        fontSize: 24,
        color: '#1a3a5c',
        fontWeight: '700',
        marginBottom: 12,
    },
    sinVehiculos: {
        fontSize: 14,
        color: '#a0b4c8',
        fontStyle: 'italic',
    },
    vehiculoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#eaf2fb',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
    },
    vehiculoInfo: {
        gap: 2,
    },
    vehiculoMarca: {
        fontSize: 13,
        color: '#4a6a82',
        fontStyle: 'italic',
    },
    vehiculoModelo: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a3a5c',
    },
    vehiculoPlacas: {
        fontSize: 13,
        color: '#4a6a82',
        fontStyle: 'italic',
    },
    editIcon: {
        fontSize: 18,
    },
});
