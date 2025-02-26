import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Dimensions, Keyboard, Pressable } from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const { height, width } = Dimensions.get("window");

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const safe = useSafeAreaInsets();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme || "light"} />
      <GestureHandlerRootView>
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={{ flex: 1 }}
        >
          <Stack
            screenOptions={{
              contentStyle: {
                height: height - safe.top - safe.bottom,
                marginTop: safe.top,
                width,
              },
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            {/* <Stack.Screen name="login" options={{ headerShown: false }} /> */}
            {/* <Stack.Screen name="+not-found" /> */}
          </Stack>
        </Pressable>
      </GestureHandlerRootView>
      <Toast />
    </ThemeProvider>
  );
}
