import CustomMap from "@/components/maps/customMap";
import { useViajesStore } from "@/store/realTripStore";
import { useLocationStore } from "@/store/useLocationStore";
import { LatLng } from "@/types/latLng";
import { Place } from "@/types/place";
import { getRemainingRoute } from "@/utils/routeProgress";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TripActiveScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const viaje = useViajesStore((state) =>
    state.viajes.find((item) => item.id === id),
  );

  const finalizarViaje = useViajesStore((state) => state.finalizarViaje);

  const {
    lastKnownLocation,
    userLocationList,
    watchLocation,
    clearWatchLocation,
    clearUserLocationList,
  } = useLocationStore();

  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [remainingRoute, setRemainingRoute] = useState<LatLng[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedLocation, setSimulatedLocation] = useState<LatLng | null>(
    null,
  );
  const [simulationIndex, setSimulationIndex] = useState(0);

  const origen: Place | null = viaje
    ? {
        address: viaje.origen,
        latitude: viaje.origenCoords.latitude,
        longitude: viaje.origenCoords.longitude,
      }
    : null;

  const destino: Place | null = viaje
    ? {
        address: viaje.destino,
        latitude: viaje.destinoCoords.latitude,
        longitude: viaje.destinoCoords.longitude,
      }
    : null;

  const currentDriverLocation = simulatedLocation ?? lastKnownLocation;

  useEffect(() => {
    clearUserLocationList();
    watchLocation();

    return () => {
      clearWatchLocation();
    };
  }, [isSimulating, routeCoordinates, viaje, finalizarViaje]);

  useEffect(() => {
    if (!currentDriverLocation || routeCoordinates.length === 0) return;

    const result = getRemainingRoute(
      routeCoordinates,
      currentDriverLocation,
      routeIndex,
    );

    setRouteIndex(result.index);
    setRemainingRoute(result.remainingRoute);
  }, [currentDriverLocation, routeCoordinates]);

  useEffect(() => {
    if (!isSimulating || routeCoordinates.length === 0) return;

    const interval = setInterval(() => {
      setSimulationIndex((prev) => {
        const nextIndex = prev + 1;

        if (nextIndex >= routeCoordinates.length) {
          setIsSimulating(false);

          if (viaje) {
            finalizarViaje(viaje.id);
          }

          router.back();

          return prev;
        }

        setSimulatedLocation(routeCoordinates[nextIndex]);
        return nextIndex;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isSimulating, routeCoordinates, viaje]);

  const handleStartSimulation = () => {
    if (routeCoordinates.length === 0) return;

    setRouteIndex(0);
    setSimulationIndex(0);
    setSimulatedLocation(routeCoordinates[0]);
    setIsSimulating(true);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
  };

  const handleFinishTrip = () => {
    if (!viaje) return;

    finalizarViaje(viaje.id);

    router.back();
  };

  const traveledRoute = useMemo(() => {
    if (isSimulating && routeCoordinates.length > 0) {
      return routeCoordinates.slice(0, simulationIndex + 1);
    }

    return userLocationList;
  }, [isSimulating, routeCoordinates, simulationIndex, userLocationList]);

  if (!viaje || !origen || !destino) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No se encontró el viaje.</Text>
      </View>
    );
  }

  if (!currentDriverLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomMap
        initialLocation={currentDriverLocation}
        showUserLocation={!isSimulating}
        originMarker={origen}
        destinationMarker={destino}
        driverLocation={currentDriverLocation}
        remainingRoute={remainingRoute}
        traveledRoute={traveledRoute}
        onDirectionsReady={setRouteCoordinates}
      />

      <View style={styles.panel}>
        <Text style={styles.title}>Viaje en curso</Text>
        <Text style={styles.text}>Destino: {destino.address}</Text>

        <TouchableOpacity
          style={styles.btnSimular}
          onPress={isSimulating ? handleStopSimulation : handleStartSimulation}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSimularText}>
            {isSimulating ? "Detener simulación" : "Simular movimiento"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnFinalizar}
          onPress={handleFinishTrip}
          activeOpacity={0.85}
        >
          <Text style={styles.btnFinalizarText}>Finalizar viaje</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripActiveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  loadingText: {
    color: "#1a3a5c",
    fontSize: 15,
    fontWeight: "600",
  },

  panel: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 6,
  },

  text: {
    fontSize: 14,
    color: "#6f8fa5",
    marginBottom: 14,
  },

  btnSimular: {
    borderWidth: 2,
    borderColor: "#1a3a5c",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },

  btnSimularText: {
    color: "#1a3a5c",
    fontWeight: "700",
    fontSize: 15,
  },

  btnFinalizar: {
    backgroundColor: "#1a3a5c",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  btnFinalizarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
