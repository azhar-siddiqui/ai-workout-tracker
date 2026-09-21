import { useAppThemeColor } from "@/theme/app-theme";
import { Lucide } from "@react-native-vector-icons/lucide";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { Tabs, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState, type ReactNode } from "react";
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_HEIGHT = 66;
const TAB_BAR_RADIUS = 50;

function useCanUseLiquidGlass() {
  const [reduceTransparency, setReduceTransparency] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceTransparencyEnabled().then((enabled) => {
      if (mounted) {
        setReduceTransparency(!!enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceTransparencyChanged",
      setReduceTransparency,
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return (
    !reduceTransparency &&
    isLiquidGlassAvailable() &&
    isGlassEffectAPIAvailable()
  );
}

function IOSGlassTabBarBackground() {
  const { colorScheme } = useColorScheme();
  const tabBackground = useAppThemeColor("tabBackground");
  const border = useAppThemeColor("border");
  const canUseGlass = useCanUseLiquidGlass();
  const scheme = colorScheme === "dark" ? "dark" : "light";

  if (!canUseGlass) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.tabBarFill,
          {
            backgroundColor: tabBackground,
            borderColor: border,
            borderWidth: StyleSheet.hairlineWidth,
          },
        ]}
      />
    );
  }

  return (
    <GlassView
      colorScheme={scheme}
      glassEffectStyle="regular"
      isInteractive
      style={[StyleSheet.absoluteFill, styles.tabBarFill]}
    />
  );
}

function AppTabs({
  tabBarBackground,
  tabBarStyle,
}: {
  tabBarBackground?: () => ReactNode;
  tabBarStyle: ViewStyle;
}) {
  const router = useRouter();
  const primary = useAppThemeColor("primary");
  const mutedForeground = useAppThemeColor("mutedForeground");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primary,
        tabBarBackground,
        tabBarInactiveTintColor: mutedForeground,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
        },
        tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: "Home tab",
          tabBarIcon: ({ color }) => (
            <Lucide color={color} name="home" size={21} />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          tabBarAccessibilityLabel: "Workouts tab",
          tabBarIcon: ({ color }) => (
            <Lucide color={color} name="activity" size={21} />
          ),
          title: "Workouts",
        }}
      />
      <Tabs.Screen
        name="create"
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push("/workout/create");
          },
        }}
        options={{
          tabBarButton: ({ onPress }) => (
            <Pressable
              accessibilityLabel="Create workout"
              accessibilityRole="button"
              className="flex-1 items-center justify-center"
              onPress={onPress}
            >
              <View className="-mt-5 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg">
                <Lucide color="white" name="plus" size={27} />
              </View>
            </Pressable>
          ),
          tabBarAccessibilityLabel: "Create workout",
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarAccessibilityLabel: "History tab",
          tabBarIcon: ({ color }) => (
            <Lucide color={color} name="calendar" size={21} />
          ),
          title: "History",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarAccessibilityLabel: "Profile tab",
          tabBarIcon: ({ color }) => (
            <Lucide color={color} name="user" size={21} />
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

function CustomTabLayout() {
  const insets = useSafeAreaInsets();
  const tabBackground = useAppThemeColor("tabBackground");
  const border = useAppThemeColor("border");
  const bottomSpace = Platform.OS === "android" ? 12 : 0;

  return (
    <AppTabs
      tabBarStyle={{
        backgroundColor: tabBackground,
        borderColor: border,
        borderRadius: TAB_BAR_RADIUS,
        borderWidth: 0.5,
        bottom: insets.bottom + bottomSpace,
        height: TAB_BAR_HEIGHT,
        left: 13,
        marginHorizontal: 12,
        paddingBottom: 7,
        paddingTop: 6,
        position: "relative",
        shadowColor: "#333",
      }}
    />
  );
}

function IOSTabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <AppTabs
      tabBarBackground={() => <IOSGlassTabBarBackground />}
      tabBarStyle={{
        backgroundColor: "transparent",
        borderRadius: TAB_BAR_RADIUS,
        borderTopWidth: 0,
        bottom: insets.bottom,
        elevation: 0,
        height: TAB_BAR_HEIGHT,
        left: 13,
        marginHorizontal: 12,
        overflow: "visible",
        paddingBottom: 7,
        paddingTop: 6,
        position: "relative",
        shadowColor: "transparent",
      }}
    />
  );
}

export default function TabLayout() {
  return Platform.OS === "ios" ? <IOSTabLayout /> : <CustomTabLayout />;
}

const styles = StyleSheet.create({
  tabBarFill: {
    borderRadius: TAB_BAR_RADIUS,
    overflow: "hidden",
  },
});
