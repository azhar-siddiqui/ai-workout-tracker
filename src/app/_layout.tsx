import { appThemeColors, appThemes } from "@/theme/app-theme";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  usePathname,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { Platform, View } from "react-native";

import { getStatusBarStyle } from "@/lib/utils";
import "@/styles/global.css";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

const navigationThemes = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: appThemeColors.light.background,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: appThemeColors.dark.background,
    },
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? "light";
  const backgroundColor = appThemeColors[scheme].background;

  const pathname = usePathname();
  const statusBarStyle = getStatusBarStyle(pathname, scheme);

  // check if font is loaded properly
  const fontReady = loaded || !!error;

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!appReady && fontReady) {
      SplashScreen.hideAsync().then(() => setAppReady(true));
    }
  }, [appReady, fontReady]);

  if (!appReady) return null;

  return (
    <ThemeProvider value={navigationThemes[scheme]}>
      <View
        style={[
          appThemes[scheme],
          {
            backgroundColor,
            flex: 1,
          },
        ]}
      >
        {Platform.OS === "ios" && <StatusBar animated style={statusBarStyle} />}
        <Stack
          screenOptions={{
            headerShown: false,
            //USE: Stack controls Android; expo-status-bar above controls iOS.
            ...(Platform.OS === "android" && { statusBarStyle }),
          }}
        >
          <Stack.Screen name="(public)" />
        </Stack>
      </View>
    </ThemeProvider>
  );
}
