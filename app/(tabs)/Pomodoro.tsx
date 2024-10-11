import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

export default function PomodoroScreen() {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const { colors } = useTheme();

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsWork(true);
    setTimeLeft(workTime * 60);
  }, [workTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playAlarm();
      setIsWork((prev) => !prev);
      setTimeLeft(isWork ? breakTime * 60 : workTime * 60);
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isWork, workTime, breakTime]);

  useEffect(() => {
    resetTimer();
  }, [workTime, resetTimer]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const playAlarm = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/notification.mp3")
    );
    await sound.playAsync();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const updateWorkTime = (text: string) => {
    const newTime = parseInt(text);
    if (!isNaN(newTime) && newTime > 0) {
      setWorkTime(newTime);
    } else if (text === "") {
      setWorkTime(25);
    }
  };

  const updateBreakTime = (text: string) => {
    const newTime = parseInt(text);
    if (!isNaN(newTime) && newTime > 0) {
      setBreakTime(newTime);
    } else if (text === "") {
      setBreakTime(5);
    }
  };

  const incrementTime = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number
  ) => {
    setter(Math.min(current + 5, 60));
  };

  const decrementTime = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number
  ) => {
    setter(Math.max(current - 5, 5));
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.timerContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          Pomodoro Timer
        </Text>
        <Text style={[styles.timer, { color: "white" }]}>
          {formatTime(timeLeft)}
        </Text>
        <Text
          style={[
            styles.phase,
            { color: isWork ? colors.error : colors.success },
          ]}
        >
          {isWork ? "Work" : "Break"}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Work Time (min)
          </Text>
          <View style={styles.inputButtonGroup}>
            <TouchableOpacity
              onPress={() => decrementTime(setWorkTime, workTime)}
            >
              <Ionicons
                name="remove-circle-outline"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              value={workTime.toString()}
              onChangeText={updateWorkTime}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              onPress={() => incrementTime(setWorkTime, workTime)}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Break Time (min)
          </Text>
          <View style={styles.inputButtonGroup}>
            <TouchableOpacity
              onPress={() => decrementTime(setBreakTime, breakTime)}
            >
              <Ionicons
                name="remove-circle-outline"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              value={breakTime.toString()}
              onChangeText={updateBreakTime}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              onPress={() => incrementTime(setBreakTime, breakTime)}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isActive ? colors.error : colors.success },
          ]}
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>{isActive ? "Pause" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.secondary }]}
          onPress={resetTimer}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timer: {
    fontSize: 72,
    fontWeight: "bold",
    marginBottom: 10,
  },
  phase: {
    fontSize: 24,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  inputWrapper: {
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputButtonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: 60,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
