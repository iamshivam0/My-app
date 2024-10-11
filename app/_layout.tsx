import { Stack } from "expo-router";
import { ProfileProvider } from "./context/ProfileContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ProfileProvider>
    </ThemeProvider>
  );
}
