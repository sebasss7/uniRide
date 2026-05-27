import { useTripStore } from "@/store/tripStore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import CustomMap from "@/components/maps/customMap";
import TripModal from "@/components/maps/modalMap";
import { reverseGeocode } from "@/services/googleMaps";
import { useLocationStore } from "@/store/useLocationStore";
import { LatLng } from "@/types/latLng";
import { Place } from "@/types/place";

import { getPlaceDetails } from "@/services/googleMaps";

const MapScreen = () => {
  const { lastKnownLocation, getLocation } = useLocationStore();
  const { origen, destino, setOrigen, setDestino } = useTripStore();

  const [modalVisible, setModalVisible] = useState(true);
  type ModalStep = "form" | "selectingOrigin" | "selectingDestination";

  const [tempLocation, setTempLocation] = useState<LatLng | null>(null);
  const [tempPlace, setTempPlace] = useState<Place | null>(null);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);

  const handleSelectLocation = async (coords: LatLng) => {
    setTempLocation(coords);
    setTempPlace(null);
    setIsResolvingLocation(true);

    const place = await reverseGeocode(coords);

    setTempPlace(place);
    setIsResolvingLocation(false);
  };

  const handleConfirmLocation = () => {
    if (!tempLocation || !tempPlace) return;

    if (step === "selectingOrigin") {
      setOrigen(tempPlace);

      setTempLocation(null);
      setTempPlace(null);

      setStep("selectingDestination");

      return;
    }

    if (step === "selectingDestination") {
      setDestino(tempPlace);

      setTempLocation(null);
      setTempPlace(null);

      setStep("form");
    }
  };

  const handleSelectOriginStep = () => {
    setTempLocation(null);
    setTempPlace(null);
    setStep("selectingOrigin");
  };

  const handleSelectDestinationStep = () => {
    setTempLocation(null);
    setTempPlace(null);
    setStep("selectingDestination");
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
        tempPlace={tempPlace}
        isResolvingLocation={isResolvingLocation}
        onSelectOrigin={handleSelectOriginStep}
        onSelectDestination={handleSelectDestinationStep}
        onConfirmLocation={handleConfirmLocation}
        onSearchOrigin={handleSearchOrigin}
        onSearchDestination={handleSearchDestination}
      />
    </View>
  );
};

export default MapScreen;
