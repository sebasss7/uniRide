import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  button: {
    backgroundColor: "#1a3a5c",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#1a3a5c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
