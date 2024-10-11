import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useProfile } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { profileName, setProfileName } = useProfile();
  const { theme, toggleTheme, colors } = useTheme();
  const [newName, setNewName] = useState(profileName);

  const handleSave = async () => {
    if (newName.trim()) {
      await setProfileName(newName.trim());
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Profile
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={newName}
            onChangeText={setNewName}
            placeholder="Enter your name"
            placeholderTextColor={colors.secondary}
          />
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Name</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>
        <View style={styles.themeContainer}>
          <View style={styles.themeRow}>
            <Ionicons
              name={theme === "dark" ? "moon" : "sunny"}
              size={24}
              color={colors.text}
            />
            <Text style={[styles.themeText, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={theme === "dark"}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    gap: 10,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  themeContainer: {
    marginTop: 5,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  themeText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
});
