import { ThemedText } from "@/components/themed-text";
import { usePermissionsStore } from "@/store/usePermissions";
import { PermissionStatus } from "@/types/location";
import { useEffect } from "react";
import { View } from "react-native";

const PermissionsScreen = () => {
  const { locationStatus, requestLocationPermission, hasRequestedLocation } =
    usePermissionsStore();

  useEffect(() => {
    if (
      !hasRequestedLocation &&
      (locationStatus === PermissionStatus.DENIED ||
        locationStatus === PermissionStatus.UNDETERMINED)
    ) {
      requestLocationPermission();
    }
  }, [locationStatus]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedText>Estado actual: {locationStatus}</ThemedText>
    </View>
  );
};

export default PermissionsScreen;
