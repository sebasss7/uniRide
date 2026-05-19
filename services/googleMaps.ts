import { LatLng } from "@/types/latLng";
import { Place } from "@/types/place";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export const reverseGeocode = async (coords: LatLng): Promise<Place | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${API_KEY}`,
    );

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];

    return {
      address: result.formatted_address,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  } catch (error) {
    console.log("Reverse geocoding error:", error);

    return null;
  }
};

export const geocodeAddress = async (
  address: string,
): Promise<Place | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address,
      )}&key=${API_KEY}`,
    );

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];

    return {
      address: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };
  } catch (error) {
    console.log("Geocoding error:", error);

    return null;
  }
};

export interface PlaceSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export const searchPlaces = async (
  input: string,
): Promise<PlaceSuggestion[]> => {
  try {
    if (input.trim().length < 3) return [];

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input,
      )}&key=${API_KEY}&language=es-419&components=country:mx`,
    );

    const data = await response.json();

    if (!data.predictions) return [];

    return data.predictions.map((item: any) => ({
      placeId: item.place_id,
      description: item.description,
      mainText: item.structured_formatting?.main_text ?? item.description,
      secondaryText: item.structured_formatting?.secondary_text ?? "",
    }));
  } catch (error) {
    console.log("Places autocomplete error:", error);

    return [];
  }
};

export const getPlaceDetails = async (
  placeId: string,
): Promise<Place | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry&key=${API_KEY}&language=es-419`,
    );

    const data = await response.json();

    const result = data.result;

    if (!result) return null;

    return {
      name: result.name,
      address: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };
  } catch (error) {
    console.log("Place details error:", error);

    return null;
  }
};

export const getPlaceLabel = (place: Place | null) => {
  if (!place) return "";

  if (place.name) return place.name;

  return place.address
    .split(",")
    .map((part) => part.trim())
    .slice(0, 2)
    .join(", ");
};
