import { commonStyles } from "@/styles/common";
import { GestureResponderEvent, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
};

export default function CustomButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      style={commonStyles.button}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={commonStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
