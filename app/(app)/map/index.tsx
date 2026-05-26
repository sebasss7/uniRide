import { useTripStore } from "@/store/tripStore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import CustomMap from "@/components/maps/customMap";
import TripModal from "@/components/maps/modalMap";
import { geocodeAddress, reverseGeocode } from "@/services/googleMaps";
import { useLocationStore } from "@/store/useLocationStore";
import { LatLng } from "@/types/latLng";

import { getPlaceDetails } from "@/services/googleMaps";
import { router } from "expo-router";

const MapScreen = () => {
  const { lastKnownLocation, getLocation } = useLocationStore();
  const { origen, destino, setOrigen, setDestino } = useTripStore();

  const [modalVisible, setModalVisible] = useState(true);
  type ModalStep = "form" | "selectingOrigin" | "selectingDestination";

  const [tempLocation, setTempLocation] = useState<LatLng | null>(null);

  const handleSelectLocation = (coords: LatLng) => {
    setTempLocation(coords);
  };

  const handleConfirmLocation = async () => {
    const handleSearchDestination = async (text: string) => {
      const place = await geocodeAddress(text);

      if (!place) return;

      setDestino(place);
    };

    if (!tempLocation) return;

    const place = await reverseGeocode(tempLocation);

    if (!place) return;

    if (step === "selectingOrigin") {
      await updateOriginFromCoords(tempLocation);

      setTempLocation(null);

      setStep("selectingDestination");

      return;
    }

    if (step === "selectingDestination") {
      await updateDestinationFromCoords(tempLocation);

      setTempLocation(null);

      setStep("form");
    }
  };

  const handleSearchOrigin = async (placeId: string) => {
    const place = await getPlaceDetails(placeId);

    if (!place) return;

    setOrigen(place);
  };

  const handleSearchDestination = async (placeId: string) => {
    const place = await getPlaceDetails(placeId);

    if (!place) return;

    setDestino(place);
  };

  const updateOriginFromCoords = async (coords: LatLng) => {
    const place = await reverseGeocode(coords);

    if (!place) return;

    setOrigen(place);
  };

  const updateDestinationFromCoords = async (coords: LatLng) => {
    const place = await reverseGeocode(coords);

    if (!place) return;

    setDestino(place);
  };

  const [step, setStep] = useState<ModalStep>("form");

  useEffect(() => {
    if (lastKnownLocation === null) {
      getLocation();
    }
  }, []);

  if (lastKnownLocation === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomMap
        initialLocation={lastKnownLocation}
        selecting={step !== "form"}
        onSelectLocation={handleSelectLocation}
        originMarker={origen}
        destinationMarker={destino}
        tempMarker={tempLocation}
        onDragOrigin={updateOriginFromCoords}
        onDragDestination={updateDestinationFromCoords}
      />
      <TripModal
        visible={modalVisible}
        origen={origen}
        destino={destino}
        step={step}
        tempLocation={tempLocation}
        onSelectOrigin={() => setStep("selectingOrigin")}
        onSelectDestination={() => setStep("selectingDestination")}
        onConfirmLocation={handleConfirmLocation}
        onSearchOrigin={handleSearchOrigin}
        onSearchDestination={handleSearchDestination}
        // onClose añadido para habilitar botón de Cancelar en el modalMap
        onClose={() => router.back()}
      />
    </View>
  );
};

export default MapScreen;
