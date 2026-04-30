import { router } from "expo-router";
import { PropsWithChildren, useEffect } from "react";
import { AppState } from "react-native";

import { PermissionStatus } from "@/types/location";

import { usePermissionsStore } from "../store/usePermissions";

const PermissionsCheckerProvider = ({ children }: PropsWithChildren) => {
  const { locationStatus, checkLocationPermission } = usePermissionsStore();

  useEffect(() => {
    if (locationStatus === PermissionStatus.CHECKING) return;

    if (
      locationStatus === PermissionStatus.UNDETERMINED ||
      locationStatus === PermissionStatus.DENIED
    ) {
      router.replace("/permissions");
      return;
    }

    router.replace("/login");
  }, [locationStatus]);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
};
export default PermissionsCheckerProvider;
