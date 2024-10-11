import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CounterScreen() {
  const [count, setCount] = useState(0);
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Counter App</Text>

      <Text style={[styles.counter, { color: colors.text }]}>{count}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setCount(count - 1)}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: colors.error }]}
        onPress={() => setCount(0)}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  counter: {
    fontSize: 60,
    fontWeight: "bold",
    margin: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    width: 80,
    alignItems: "center",
  },
  resetButton: {
    padding: 15,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
