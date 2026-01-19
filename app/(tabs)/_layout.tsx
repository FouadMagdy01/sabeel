import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import { forwardRef } from "react";
import { Pressable, Text, View } from "react-native";

type TabButtonProps = TabTriggerSlotProps & {
  children: string;
  icon:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  iconFamily?: "Ionicons" | "MaterialCommunityIcons";
};

const TabButton = forwardRef<View, TabButtonProps>(
  ({ children, isFocused, icon, iconFamily = "Ionicons", ...props }, ref) => {
    const IconComponent =
      iconFamily === "Ionicons" ? Ionicons : MaterialCommunityIcons;

    return (
      <Pressable
        ref={ref}
        {...props}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: isFocused ? "#335f31ff" : "transparent",
          borderRadius: 20,
          minWidth: 70,
        }}
      >
        <IconComponent
          name={icon as any}
          size={24}
          color={isFocused ? "#FFFFFF" : "#8E8E93"}
        />
        <Text
          style={{
            color: isFocused ? "#FFFFFF" : "#8E8E93",
            fontSize: 12,
            fontWeight: isFocused ? "600" : "400",
          }}
        >
          {children}
        </Text>
      </Pressable>
    );
  }
);

export default function TabLayout() {
  return (
    <Tabs>
      <TabSlot />

      <TabList
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 8,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <TabTrigger name="settings" href="/settings" asChild>
          <TabButton icon="settings-outline" iconFamily="Ionicons">
            الإعدادات
          </TabButton>
        </TabTrigger>
        <TabTrigger name="prayers" href="/prayers" asChild>
          <TabButton icon="mosque" iconFamily="MaterialCommunityIcons">
            الصلوات
          </TabButton>
        </TabTrigger>
        <TabTrigger name="quran" href="/quran" asChild>
          <TabButton icon="book-outline" iconFamily="Ionicons">
            القرآن
          </TabButton>
        </TabTrigger>
        <TabTrigger name="library" href="/library" asChild>
          <TabButton icon="library-outline" iconFamily="Ionicons">
            المكتبة
          </TabButton>
        </TabTrigger>
        <TabTrigger name="home" href="/home" asChild>
          <TabButton icon="home" iconFamily="Ionicons">
            الرئيسية
          </TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
