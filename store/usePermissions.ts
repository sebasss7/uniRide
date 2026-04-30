import {
  checkLocationPermission,
  requestLocationPermission,
} from "@/core/actions/permissions/location";
import { PermissionStatus } from "@/types/location";
import { create } from "zustand";

interface PermissionsState {
  locationStatus: PermissionStatus;

  hasRequestedLocation: boolean;

  requestLocationPermission: () => Promise<PermissionStatus>;
  checkLocationPermission: () => Promise<PermissionStatus>;
}

export const usePermissionsStore = create<PermissionsState>()((set, get) => ({
  locationStatus: PermissionStatus.CHECKING,
  hasRequestedLocation: false,

  requestLocationPermission: async () => {
    const status = await requestLocationPermission();

    set({
      locationStatus: status,
      hasRequestedLocation: true,
    });

    return status;
  },

  checkLocationPermission: async () => {
    const status = await checkLocationPermission();
    set({ locationStatus: status });
    return status;
  },
}));
