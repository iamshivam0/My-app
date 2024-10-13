import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";

export default function Layout() {
  const { profileName } = useProfile();
  const { colors } = useTheme();
  const router = useRouter();

  const tabScreens: {
    name: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { name: "index", title: "Counter", icon: "calculator-outline" },
    { name: "Todopage", title: "Todo", icon: "list-outline" },
    { name: "Pomodoro", title: "Pomodoro", icon: "timer-outline" },
    { name: "Calculator", title: "Calculator", icon: "calculator" },
    { name: "GoalSetting", title: "Goal Setting", icon: "flag-outline" },
    { name: "ExpenseTracker", title: "Expenses", icon: "cash-outline" },
    { name: "settings", title: "Settings", icon: "settings-outline" },
  ];

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.background,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
      }}
    >
      {tabScreens.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            drawerIcon: ({ color, size }) => (
              <Ionicons name={screen.icon} size={size} color={color} />
            ),
            headerRight: () => (
              <View style={styles.headerRight}>
                {profileName && (
                  <TouchableOpacity onPress={() => router.push("/settings")}>
                    <Text
                      style={[styles.profileName, { color: colors.secondary }]}
                    >
                      Welcome, {profileName}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* Removed the settings icon */}
              </View>
            ),
          }}
        />
      ))}
    </Drawer>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
  profileName: {
    fontSize: 14,
  },
});
