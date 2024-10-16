import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../context/ThemeContext";
import { Audio } from "expo-av";

const Calculator = () => {
  const { theme } = useTheme();
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [fontSize, setFontSize] = useState(70);
  const displayRef = useRef<View>(null);

  // Function to play the sound
  const playSong = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/thala.mp3")
    );
    setSound(sound); // Save the sound object in state
    await sound.playAsync();
  };

  const playSong2 = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/69.mp3")
    );
    setSound(sound); // Save the sound object in state
    await sound.playAsync();
  };

  // Function to stop the sound
  const stopSong = async () => {
    if (sound) {
      await sound.stopAsync(); // Stop the currently playing sound
      await sound.unloadAsync(); // Unload the sound from memory
      setSound(null); // Reset sound state
    }
  };

  // Cleanup effect to unload sound when the component is unmounted
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    adjustFontSize();
  }, [display]);

  const adjustFontSize = () => {
    if (displayRef.current) {
      displayRef.current.measure((x, y, width, height, pageX, pageY) => {
        const newFontSize = Math.min(70, (width * 0.9) / display.length);
        setFontSize(newFontSize);
      });
    }
  };

  const handleNumberPress = (num: string) => {
    if (display === "0") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperationPress = (op: string) => {
    setPrevValue(parseFloat(display));
    setOperation(op);
    setDisplay("0");
  };

  const handleEqualsPress = async () => {
    if (prevValue !== null && operation !== null) {
      const current = parseFloat(display);
      let result;
      switch (operation) {
        case "+":
          result = prevValue + current;
          break;
        case "-":
          result = prevValue - current;
          break;
        case "×":
          result = prevValue * current;
          break;
        case "÷":
          result = prevValue / current;
          break;
        default:
          return;
      }
      if (result === 7) {
        await playSong(); // Play song only if result is 7
        setDisplay("Thala for a reason");
      } else if (result === 69) {
        await playSong2(); // Play song only if result is 69
        setDisplay("ONII-CHANN");
      } else {
        setDisplay(result.toString());
      }
      setPrevValue(null);
      setOperation(null);
    }
  };

  const handleClearPress = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperation(null);
    stopSong(); // Stop the song when "C" button is pressed
  };

  const renderButton = (text: string, onPress: () => void, style?: object) => (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme === "light" ? "#fff" : "#333" },
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          { color: theme === "light" ? "#333" : "#fff" },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#fff" : "#000" },
      ]}
    >
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      <View style={styles.display} ref={displayRef} onLayout={adjustFontSize}>
        <Text
          style={[
            styles.displayText,
            { color: theme === "light" ? "#333" : "#fff", fontSize: fontSize },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {display}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        {renderButton("C", handleClearPress, styles.functionButton)}
        {renderButton(
          "±",
          () => setDisplay((parseFloat(display) * -1).toString()),
          styles.functionButton
        )}
        {renderButton(
          "%",
          () => setDisplay((parseFloat(display) / 100).toString()),
          styles.functionButton
        )}
        {renderButton(
          "÷",
          () => handleOperationPress("÷"),
          styles.operationButton
        )}
        {renderButton("7", () => handleNumberPress("7"))}
        {renderButton("8", () => handleNumberPress("8"))}
        {renderButton("9", () => handleNumberPress("9"))}
        {renderButton(
          "×",
          () => handleOperationPress("×"),
          styles.operationButton
        )}
        {renderButton("4", () => handleNumberPress("4"))}
        {renderButton("5", () => handleNumberPress("5"))}
        {renderButton("6", () => handleNumberPress("6"))}
        {renderButton(
          "-",
          () => handleOperationPress("-"),
          styles.operationButton
        )}
        {renderButton("1", () => handleNumberPress("1"))}
        {renderButton("2", () => handleNumberPress("2"))}
        {renderButton("3", () => handleNumberPress("3"))}
        {renderButton(
          "+",
          () => handleOperationPress("+"),
          styles.operationButton
        )}
        {renderButton("0", () => handleNumberPress("0"), styles.zeroButton)}
        {renderButton(".", () => handleNumberPress("."))}
        {renderButton("=", handleEqualsPress, styles.operationButton)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  display: {
    padding: 20,
    alignItems: "flex-end",
    justifyContent: "center",
    minHeight: 120,
  },
  displayText: {
    fontSize: 70,
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    width: "25%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#333",
  },
  buttonText: {
    fontSize: 30,
  },
  zeroButton: {
    width: "50%",
  },
  functionButton: {
    backgroundColor: "#a6a6a6",
  },
  operationButton: {
    backgroundColor: "#ff9500",
  },
});

export default Calculator;
