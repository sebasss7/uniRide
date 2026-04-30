import PermissionsCheckerProvider from "@/providers/PermissionsCheckerProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <PermissionsCheckerProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      ></Stack>
    </PermissionsCheckerProvider>
  );
}
