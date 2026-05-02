import { useTripStore } from "@/store/tripStore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import CustomMap from "@/components/maps/customMap";
import TripModal from "@/components/maps/modalMap";
import { useLocationStore } from "@/store/useLocationStore";

const MapScreen = () => {
  const { lastKnownLocation, getLocation } = useLocationStore();
  const { origen, destino, setOrigen, setDestino } = useTripStore();

  const [modalVisible, setModalVisible] = useState(true);
  const [selecting, setSelecting] = useState<"origen" | "destino" | null>(null);

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
        selecting={selecting}
        setOrigen={setOrigen}
        setDestino={setDestino}
        setSelecting={setSelecting}
      />

      <TripModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        origen={origen}
        destino={destino}
        setSelecting={setSelecting}
      />
    </View>
  );
};

export default MapScreen;
