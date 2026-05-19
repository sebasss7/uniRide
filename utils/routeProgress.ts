// utils/routeProgress.ts

import { LatLng } from "@/types/latLng";

const toRad = (value: number) => (value * Math.PI) / 180;

export const getDistanceInMeters = (a: LatLng, b: LatLng) => {
  const R = 6371000;

  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const findClosestRouteIndex = (
  route: LatLng[],
  currentLocation: LatLng,
  lastIndex: number,
) => {
  if (route.length === 0) return 0;

  let closestIndex = lastIndex;
  let closestDistance = Infinity;

  const start = Math.max(0, lastIndex - 5);
  const end = Math.min(route.length, lastIndex + 100);

  for (let i = start; i < end; i++) {
    const distance = getDistanceInMeters(route[i], currentLocation);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
};

export const getRemainingRoute = (
  route: LatLng[],
  currentLocation: LatLng,
  lastIndex: number,
) => {
  if (route.length === 0) {
    return {
      index: 0,
      remainingRoute: [],
    };
  }

  const closestIndex = findClosestRouteIndex(route, currentLocation, lastIndex);

  const safeIndex = Math.max(lastIndex, closestIndex);

  return {
    index: safeIndex,
    remainingRoute: [currentLocation, ...route.slice(safeIndex)],
  };
};
