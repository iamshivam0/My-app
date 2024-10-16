import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { Drawer } from "expo-router/drawer";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";

// Custom drawer content component
function CustomDrawerContent(props: any) {
  const { profileName } = useProfile();
  const { colors, theme } = useTheme();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.drawerScrollView,
        { backgroundColor: colors.background },
      ]}
    >
      <LinearGradient
        colors={
          theme === "dark"
            ? [colors.secondary, colors.primary]
            : ["#f0f4ff", "#d9e2ff"]
        }
        style={styles.drawerHeader}
      >
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.profileImage}
          resizeMode="cover"
          accessibilityLabel="Profile picture"
        />
        <Text
          style={[
            styles.profileName,
            { color: theme === "dark" ? "#ffffff" : "#333333" },
          ]}
        >
          {profileName || "Guest"}
        </Text>
      </LinearGradient>
      <View style={styles.drawerContent}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

// Custom drawer toggle button
function CustomDrawerToggle() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const spinValue = React.useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const toggleDrawer = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(spinValue, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <TouchableOpacity style={styles.drawerToggle} onPress={toggleDrawer}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Ionicons name="menu" size={28} color={colors.text} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function Layout() {
  const { colors, theme } = useTheme();

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
    { name: "Notes", title: "Notes", icon: "clipboard-outline" },
    { name: "settings", title: "Settings", icon: "settings-outline" },
  ];

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.background,
          width: "80%",
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: styles.drawerLabel,
        headerLeft: () => <CustomDrawerToggle />,
        drawerType: "slide",
        overlayColor: "rgba(0,0,0,0.5)",
        sceneContainerStyle: {
          backgroundColor: colors.background,
        },
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
          }}
        />
      ))}
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerScrollView: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
  },
  drawerContent: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  drawerLabel: {
    marginLeft: -16,
    fontSize: 16,
    fontWeight: "500",
  },
  drawerToggle: {
    marginLeft: 15,
    padding: 5,
  },
});
