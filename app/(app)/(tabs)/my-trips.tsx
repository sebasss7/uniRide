import HistoryCard from "@/components/trips/HistoryCard";
import { historyMock } from "@/mock/history";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function HistoryScreen() {
    const myId = '1';

    const myTrips = historyMock.filter(viaje => viaje.conductor_id === myId);

    const renderTripCard = ({ item: viaje }: { item: any }) => {
        return (
            <HistoryCard viaje={viaje} />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {myTrips.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aún no has registrado viajes!</Text>
                </View>
            ) : (
                <FlatList
                    data={myTrips}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTripCard}
                    contentContainerStyle={styles.listaContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f7fc',
    },
    listaContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#7a9bb5',
        textAlign: 'center',
    }
});