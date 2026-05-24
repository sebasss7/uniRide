import {
    getPlaceDetails,
    PlaceSuggestion,
    searchPlaces,
} from "@/services/googleMaps";
import { Place } from "@/types/place";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectPlace: (place: Place) => void;
}

const PlaceInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  onSelectPlace,
}: Props) => {
  const inputRef = useRef<TextInput>(null);

  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused || value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      const results = await searchPlaces(value);

      setSuggestions(results);
      setLoading(false);
    }, 350);

    return () => clearTimeout(timeout);
  }, [value, focused]);

  const handleSelectSuggestion = async (item: PlaceSuggestion) => {
    setFocused(false);
    setSuggestions([]);
    setLoading(false);

    inputRef.current?.blur();
    Keyboard.dismiss();

    const place = await getPlaceDetails(item.placeId);

    if (!place) return;

    const textToShow = item.mainText || item.description;

    onChangeText(textToShow);
    onSelectPlace(place);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#6f8fa5"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
      />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" />
        </View>
      )}

      {suggestions.length > 0 && focused && (
        <View style={styles.suggestionsBox}>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.placeId}
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
              activeOpacity={0.75}
            >
              <Text style={styles.suggestionMain}>
                {item.mainText || item.description}
              </Text>

              {!!item.secondaryText && (
                <Text style={styles.suggestionSecondary}>
                  {item.secondaryText}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default PlaceInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    zIndex: 20,
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
  },

  loading: {
    marginTop: 6,
    alignItems: "flex-start",
  },

  suggestionsBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#d0e4f0",
    overflow: "hidden",
  },

  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  suggestionMain: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a3a5c",
  },

  suggestionSecondary: {
    fontSize: 12,
    color: "#6f8fa5",
    marginTop: 3,
  },
});
