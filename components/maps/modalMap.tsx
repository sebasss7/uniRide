import { PlaceSuggestion, searchPlaces } from "@/services/googleMaps";
import { LatLng } from "@/types/latLng";
import { Place } from "@/types/place";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;

  origen: Place | null;
  destino: Place | null;

  step: "form" | "selectingOrigin" | "selectingDestination";

  tempLocation: LatLng | null;

  onSelectOrigin: () => void;
  onSelectDestination: () => void;

  onConfirmLocation: () => void;
  onSearchOrigin: (text: string) => void;
  onSearchDestination: (text: string) => void;
}

export default function TripModal({
  visible,
  origen,
  destino,
  step,
  tempLocation,
  onSelectOrigin,
  onSelectDestination,
  onConfirmLocation,
  onSearchOrigin,
  onSearchDestination,
}: Props) {
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");

  const [originSuggestions, setOriginSuggestions] = useState<PlaceSuggestion[]>(
    [],
  );

  const [destinationSuggestions, setDestinationSuggestions] = useState<
    PlaceSuggestion[]
  >([]);

  useEffect(() => {
    setOriginText(origen?.address || "");
  }, [origen]);

  useEffect(() => {
    setDestinationText(destino?.address || "");
  }, [destino]);

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
      style={styles.wrapper}
    >
      <View
        style={[styles.container, step !== "form" && styles.compactContainer]}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 80,
          }}
        >
          {step === "form" ? (
            <>
              <Text style={styles.title}>Nuevo viaje</Text>

              <View style={styles.input}>
                <TextInput
                  placeholder="Punto de partida"
                  value={originText}
                  onChangeText={async (text) => {
                    setOriginText(text);

                    const results = await searchPlaces(text);

                    setOriginSuggestions(results);
                  }}
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    onSearchOrigin(originText);
                  }}
                />
                {originSuggestions.map((item) => (
                  <TouchableOpacity
                    key={item.placeId}
                    style={styles.suggestionItem}
                    onPress={() => {
                      onSearchOrigin(item.placeId);

                      setOriginText(item.description);

                      setOriginSuggestions([]);
                    }}
                  >
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={onSelectOrigin}>
                <Text style={styles.mapButton}>Elegir origen en el mapa</Text>
              </TouchableOpacity>

              <View style={styles.input}>
                <View style={styles.input}>
                  <TextInput
                    placeholder="Punto de destino"
                    value={destinationText}
                    onChangeText={async (text) => {
                      setDestinationText(text);

                      const results = await searchPlaces(text);

                      setDestinationSuggestions(results);
                    }}
                    returnKeyType="search"
                    onSubmitEditing={() => {
                      onSearchDestination(destinationText);
                    }}
                  />
                  {destinationSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item.placeId}
                      style={styles.suggestionItem}
                      onPress={() => {
                        onSearchDestination(item.placeId);

                        setDestinationText(item.description);

                        setDestinationSuggestions([]);
                      }}
                    >
                      <Text>{item.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity onPress={onSelectDestination}>
                <Text style={styles.mapButton}>Elegir destino en el mapa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  router.replace("/home");
                }}
              >
                <Text style={styles.btnText}>Continuar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>
                {step === "selectingOrigin"
                  ? "Selecciona tu punto de partida"
                  : "Selecciona tu destino"}
              </Text>

              <Text style={styles.subtitle}>
                Presiona el mapa para elegir un punto
              </Text>

              <View style={styles.selectedBox}>
                <Text>
                  {tempLocation
                    ? `${tempLocation.latitude}, ${tempLocation.longitude}`
                    : "Aún no seleccionas un punto"}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.btn, !tempLocation && { opacity: 0.5 }]}
                disabled={!tempLocation}
                onPress={onConfirmLocation}
              >
                <Text style={styles.btnText}>Confirmar selección</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    zIndex: 999,
    elevation: 999,
  },
  subtitle: {
    color: "#4b6584",
    marginBottom: 16,
    fontSize: 14,
  },

  selectedBox: {
    backgroundColor: "#eef6fb",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },

  mapButton: {
    color: "#1a3a5c",
    fontWeight: "700",
    marginBottom: 20,
  },

  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 120,

    minHeight: 600,
    maxHeight: "94%",

    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },

  compactContainer: {
    minHeight: 350,
    maxHeight: 350,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#d0e4f0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a3a5c",
    marginBottom: 6,
    marginTop: 8,
  },

  input: {
    backgroundColor: "#dceef9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1a3a5c",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  rowItem: {
    flex: 1,
  },

  btn: {
    backgroundColor: "#1a3a5c",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  close: {
    textAlign: "center",
    marginTop: 12,
    color: "#1a3a5c",
    fontWeight: "600",
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
