import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: ColorScheme;
}

interface ColorScheme {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  card: string;
  border: string;
  error: string;
  tabBar: string;
  success: string; // Add this line
}

const lightColors: ColorScheme = {
  background: "#FFFFFF",
  text: "#000000",
  primary: "#007AFF",
  secondary: "#666666",
  card: "#F5F5F5",
  border: "#E0E0E0",
  error: "#FF3B30",
  tabBar: "#FFFFFF",
  success: "#4CAF50", // Add this line
};

const darkColors: ColorScheme = {
  background: "#1A1A1A",
  text: "#FFFFFF",
  primary: "#0A84FF",
  secondary: "#999999",
  card: "#2C2C2E",
  border: "#3A3A3C",
  error: "#FF453A",
  tabBar: "#1C1C1E",
  success: "#45a049", // Add this line
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemColorScheme || "light");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = (await AsyncStorage.getItem("theme")) as ThemeType;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    try {
      await AsyncStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (undefined === context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
