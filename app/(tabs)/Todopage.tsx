import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Audio } from "expo-av";

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
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  timeInput: {
    width: 80,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  todoContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: {
    flex: 1,
  },
  timerText: {
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  completeButton: {
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
});

interface Todo {
  id: string;
  text: string;
  timeLimit: number;
  startTime: number;
  completed: boolean;
}

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const { colors } = useTheme();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTodos((currentTodos) =>
        currentTodos.map((todo) => {
          if (!todo.completed && getRemainingTime(todo) <= 0) {
            playAlarm();
            showModal(`Time's up for task: ${todo.text}`);
            return { ...todo, completed: true };
          }
          return todo;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const playAlarm = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/alarm.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  };

  const stopAlarm = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const showModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const addTodo = () => {
    if (inputText.trim() && timeLimit.trim()) {
      const timeLimitNumber = parseInt(timeLimit);
      if (isNaN(timeLimitNumber) || timeLimitNumber <= 0) {
        showModal("Please enter a valid time limit in minutes.");
        return;
      }
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: inputText.trim(),
          timeLimit: timeLimitNumber * 60 * 1000,
          startTime: Date.now(),
          completed: false,
        },
      ]);
      setInputText("");
      setTimeLimit("");
    }
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completeTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
    playAlarm();
    showModal("Task Completed! Great job!");
  };

  const getRemainingTime = (todo: Todo) => {
    if (todo.completed) return 0;
    const elapsedTime = Date.now() - todo.startTime;
    const remainingTime = todo.timeLimit - elapsedTime;
    return Math.max(0, remainingTime);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Todo Notes</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter a new todo"
          placeholderTextColor={colors.text}
        />
        <TextInput
          style={[
            styles.timeInput,
            { color: colors.text, borderColor: colors.border },
          ]}
          value={timeLimit}
          onChangeText={setTimeLimit}
          placeholder="Time(m)"
          placeholderTextColor={colors.text}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={addTodo}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.todoItem, { backgroundColor: colors.card }]}>
            <View style={styles.todoContent}>
              <Text
                style={[
                  styles.todoText,
                  {
                    color: colors.text,
                    textDecorationLine: item.completed
                      ? "line-through"
                      : "none",
                  },
                ]}
              >
                {item.text}
              </Text>
              <Text style={[styles.timerText, { color: colors.text }]}>
                {formatTime(getRemainingTime(item))}
              </Text>
            </View>
            {!item.completed && (
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  { backgroundColor: colors.success },
                ]}
                onPress={() => completeTodo(item.id)}
              >
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: colors.error }]}
              onPress={() => removeTodo(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          stopAlarm();
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalText, { color: colors.text }]}>
              {modalMessage}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setModalVisible(!modalVisible);
                stopAlarm();
              }}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
