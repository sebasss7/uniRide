import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import MapView, { MapPressEvent } from "react-native-maps";

import { useLocationStore } from "@/store/useLocationStore";
import { LatLng } from "@/types/latLng";

import { Marker } from "react-native-maps";

interface Props extends ViewProps {
  initialLocation: LatLng;
  showUserLocation?: boolean;

  selecting?: "origen" | "destino" | null;
  setOrigen?: (value: string) => void;
  setDestino?: (value: string) => void;
  setSelecting?: (value: null) => void;
}

const CustomMap = ({
  initialLocation,
  showUserLocation = true,
  selecting,
  setOrigen,
  setDestino,
  setSelecting,
  ...rest
}: Props) => {
  const mapRef = useRef<MapView>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(true);

  const [originMarker, setOriginMarker] = useState<LatLng | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<LatLng | null>(
    null,
  );

  const { watchLocation, clearWatchLocation, lastKnownLocation, getLocation } =
    useLocationStore();

  useEffect(() => {
    watchLocation();

    return () => {
      clearWatchLocation();
    };
  }, []);

  useEffect(() => {
    if (lastKnownLocation && isFollowingUser) {
      moveCameraToLocation(lastKnownLocation);
    }
  }, [lastKnownLocation, isFollowingUser]);

  const moveCameraToLocation = (latLng: LatLng) => {
    if (!mapRef.current) return;

    mapRef.current.animateCamera({
      center: latLng,
    });
  };

  const moveToCurrentLocation = async () => {
    if (!lastKnownLocation) {
      moveCameraToLocation(initialLocation);
    } else {
      moveCameraToLocation(lastKnownLocation);
    }

    const location = await getLocation();
    if (!location) return;

    moveCameraToLocation(location);
  };

  return (
    <View {...rest}>
      <MapView
        ref={mapRef}
        onTouchStart={() => setIsFollowingUser(false)}
        showsUserLocation={showUserLocation}
        style={styles.map}
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e: MapPressEvent) => {
          if (!selecting) return;

          const coords = e.nativeEvent.coordinate;

          if (selecting === "origen") {
            setOriginMarker(coords);
            setOrigen?.(`${coords.latitude}, ${coords.longitude}`);
          }

          if (selecting === "destino") {
            setDestinationMarker(coords);
            setDestino?.(`${coords.latitude}, ${coords.longitude}`);
          }

          setSelecting?.(null);
        }}
      >
        {originMarker && (
          <Marker
            coordinate={originMarker}
            title="Origen"
            draggable
            onDragEnd={(e) => {
              const coords = e.nativeEvent.coordinate;
              setOriginMarker(coords);
              setOrigen?.(`${coords.latitude}, ${coords.longitude}`);
            }}
          />
        )}

        {destinationMarker && (
          <Marker
            coordinate={destinationMarker}
            title="Destino"
            pinColor="blue"
            draggable
            onDragEnd={(e) => {
              const coords = e.nativeEvent.coordinate;
              setDestinationMarker(coords);
              setDestino?.(`${coords.latitude}, ${coords.longitude}`);
            }}
          />
        )}
      </MapView>
    </View>
  );
};
export default CustomMap;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
