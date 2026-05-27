import { PlaceSuggestion, searchPlaces } from "@/services/googleMaps";
import { LatLng } from "@/types/latLng";
import { Place } from "@/types/place";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardEvent,
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

  const scrollViewRef = useRef<ScrollView>(null);
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
    const hideEvent =
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";

    const onShow = (e: KeyboardEvent) => {
      const keyboardHeight = e.endCoordinates.height;

      Animated.timing(keyboardOffset, {
        toValue: keyboardHeight,
        duration: Platform.OS === "android" ? 150 : 250,
        useNativeDriver: false,
      }).start();
    };

    const onHide = () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: Platform.OS === "android" ? 150 : 250,
        useNativeDriver: false,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardOffset]);

  useEffect(() => {
    setOriginText(origen?.address || "");
  }, [origen]);

  useEffect(() => {
    setDestinationText(destino?.address || "");
  }, [destino]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.wrapper, { bottom: keyboardOffset }]}>
      <View
        style={[styles.container, step !== "form" && styles.compactContainer]}
      >
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {step === "form" ? (
            <>
              <Text style={styles.title}>Nuevo viaje</Text>

              <View style={styles.input}>
                <TextInput
                  placeholder="Punto de partida"
                  placeholderTextColor="#7a9bb5"
                  value={originText}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                    }, 100);
                  }}
                  onChangeText={async (text) => {
                    setOriginText(text);
                    const results = await searchPlaces(text);
                    setOriginSuggestions(results);
                  }}
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    onSearchOrigin(originText);
                  }}
                  style={styles.textInput}
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
                    <Text style={styles.suggestionText}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={onSelectOrigin}>
                <Text style={styles.mapButton}>Elegir origen en el mapa</Text>
              </TouchableOpacity>
              <View style={styles.input}>
                <TextInput
                  placeholder="Punto de destino"
                  placeholderTextColor="#7a9bb5"
                  value={destinationText}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                  }}
                  onChangeText={async (text) => {
                    setDestinationText(text);
                    const results = await searchPlaces(text);
                    setDestinationSuggestions(results);
                  }}
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    onSearchDestination(destinationText);
                  }}
                  style={styles.textInput}
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
                    <Text style={styles.suggestionText}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                ))}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    zIndex: 999,
    elevation: 999,
  },

  scrollContent: {
    paddingBottom: 32,
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
    paddingBottom: 24,
    minHeight: "30%",
    maxHeight: "87%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },

  compactContainer: {
    minHeight: 350,
    maxHeight: 350,
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
    paddingVertical: 4,
    marginBottom: 10,
  },

  textInput: {
    fontSize: 14,
    color: "#1a3a5c",
    paddingVertical: 10,
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

  suggestionText: {
    fontSize: 14,
    color: "#1a3a5c",
  },
});
