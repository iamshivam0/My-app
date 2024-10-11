import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal Screen</Text>
      <Text style={styles.description}>
        This is a modal screen that can be accessed from anywhere in the app.
      </Text>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Close Modal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  closeButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
