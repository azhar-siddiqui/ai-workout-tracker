import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import logo from "@/assets/images/app-images/logo.png";
import streakIcon from "@/assets/images/app-images/streak-icon.png";

export default function HomeScreen() {
  return (
    <SafeAreaScreen edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-5 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* {Header Section} */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-0">
            <View className="-ml-4 h-11 w-16 overflow-hidden">
              <Image
                source={logo}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <Text
              accessibilityRole="header"
              className="font-inter-bold text-[22px] text-foreground"
            >
              MyWorkout
            </Text>
          </View>
          <Pressable
            className="h-11 flex-row items-center rounded-full border border-border bg-card px-3 active:bg-muted"
            onPress={() => {}}
          >
            <Image
              source={streakIcon}
              className="h-6 w-6"
              resizeMode="contain"
            />
            <Text className="ml-1.5 mr-0.5 font-inter-bold text-[14px] text-foreground">
              {0}
            </Text>
          </Pressable>
        </View>

        <View>
          <Text>HomeScreen</Text>
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
