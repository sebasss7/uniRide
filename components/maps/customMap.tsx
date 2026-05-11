import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import MapView, { MapPressEvent } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { useLocationStore } from "@/store/useLocationStore";
import { LatLng } from "@/types/latLng";

import { Place } from "@/types/place";
import { Marker } from "react-native-maps";

interface Props extends ViewProps {
  initialLocation: LatLng;
  showUserLocation?: boolean;
  selecting?: boolean;
  originMarker?: Place | null;
  destinationMarker?: Place | null;
  tempMarker?: LatLng | null;

  onSelectLocation?: (coords: LatLng) => void;
  onDragOrigin?: (coords: LatLng) => void;
  onDragDestination?: (coords: LatLng) => void;
}

const CustomMap = ({
  initialLocation,
  showUserLocation = true,
  selecting,
  onSelectLocation,
  onDragOrigin,
  onDragDestination,
  originMarker,
  destinationMarker,

  ...rest
}: Props) => {
  const mapRef = useRef<MapView>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(true);

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

          onSelectLocation?.(coords);
        }}
      >
        {originMarker && destinationMarker && (
          <MapViewDirections
            origin={{
              latitude: originMarker.latitude,
              longitude: originMarker.longitude,
            }}
            destination={{
              latitude: destinationMarker.latitude,
              longitude: destinationMarker.longitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
        {originMarker && (
          <Marker
            coordinate={{
              latitude: originMarker.latitude,
              longitude: originMarker.longitude,
            }}
            title="Origen"
            draggable
            onDragEnd={(e) => {
              const coords = e.nativeEvent.coordinate;
              onDragOrigin?.(coords);
            }}
          />
        )}

        {destinationMarker && (
          <Marker
            coordinate={{
              latitude: destinationMarker.latitude,
              longitude: destinationMarker.longitude,
            }}
            title="Destino"
            pinColor="blue"
            draggable
            onDragEnd={(e) => {
              const coords = e.nativeEvent.coordinate;
              onDragDestination?.(coords);
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
