import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LandingPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [profileName, setProfileName] = useState("");
  const [tempName, setTempName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkProfileName();
  }, []);

  const checkProfileName = async () => {
    try {
      const storedName = await AsyncStorage.getItem("profileName");
      if (storedName) {
        setProfileName(storedName);
        setIsNameSet(true);
      }
    } catch (error) {
      console.error("Error checking profile name:", error);
    }
  };

  const handleSaveName = async () => {
    if (tempName.trim().length === 0) {
      Alert.alert("Invalid Name", "Please enter a valid name.");
      return;
    }
    try {
      await AsyncStorage.setItem("profileName", tempName);
      setProfileName(tempName);
      setIsNameSet(true);
    } catch (error) {
      console.error("Error saving profile name:", error);
      Alert.alert("Error", "Failed to save your name. Please try again.");
    }
  };

  const handleGetStarted = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      router.replace("/(tabs)");
    });
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Welcome to Multi-App
        </Text>
        <Text style={[styles.subtitle, { color: theme.icon }]}>
          Manage your Day with ease
        </Text>
        {!isNameSet ? (
          <>
            <Text style={[styles.instruction, { color: theme.text }]}>
              Please set up your profile name to continue:
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.icon },
              ]}
              placeholder="Enter your name"
              placeholderTextColor={theme.icon}
              value={tempName}
              onChangeText={setTempName}
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.tint }]}
              onPress={handleSaveName}
            >
              <Text style={[styles.buttonText, { color: theme.background }]}>
                Save Name
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Hello, {profileName}!
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.tint }]}
              onPress={handleGetStarted}
            >
              <Text style={[styles.buttonText, { color: theme.background }]}>
                Get Started
              </Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: "center",
  },
  instruction: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  greeting: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
